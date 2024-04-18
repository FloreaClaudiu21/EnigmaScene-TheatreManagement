"use client";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { PaperclipIcon } from "lucide-react";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { FilterMap } from "../../admin/table/Table";
import { useReactToPrint } from "react-to-print";
import RaportBody from "./RaportBody";

function TableRaport({
	page_title,
	columns,
	data,
	filters,
}: {
	data: any[];
	columns: any;
	page_title: string;
	filters: FilterMap[];
}) {
	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date("01.01.2024"),
		to: new Date(),
	});
	const [rowSelection, setRowSelection] = useState({});
	const [title, setTitle] = useState("Raport evidenta");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<
		VisibilityState
	>({});
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const dateD = new Date();
			const itemDate = new Date(item.createdAt);
			return (
				itemDate >= (date?.from ?? dateD) && itemDate <= (date?.to ?? dateD)
			);
		});
	}, [data, date]);
	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			rowSelection,
			columnVisibility,
		},
	});
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	useEffect(() => {
		const list: string[] = [];
		const colSel = table.getColumn("select");
		const colActions = table.getColumn("actions");
		colActions?.toggleVisibility();
		colSel?.toggleVisibility();
		table.getAllColumns().map((column) => {
			if (column.getIsVisible()) {
				list.push(column.id);
			}
		});
		setSelectedValues(list);
		table.setPageSize(filteredData.length);
	}, [filteredData]);
	return (
		<div>
			<div className="flex flex-row items-center justify-between flex-wrap">
				<h1 className="text-4xl font-bold mb-4 md:mb-0">{page_title}</h1>
				<div className="flex flex-row gap-4 justify-end md:justify-normal">
					<Button
						radius="none"
						color="primary"
						onClick={handlePrint}
						className="flex justify-center place-items-center text-md shadow-md"
					>
						<PaperclipIcon size={18} /> Make Raport
					</Button>
				</div>
			</div>
			<hr className="mt-4" />
			<div className="py-10 pt-8">
				<div className="flex flex-col items-start justify-between gap-4">
					<Input
						radius="none"
						value={title}
						label={"Raport title"}
						variant="bordered"
						onChange={(event) => {
							setTitle(event.target.value);
						}}
					/>
					<div className="font-semibold text-sm">
						<p>Filters:</p>
					</div>
					<div className="flex items-center gap-2 z-50">
						<DatePickerWithRange date={date} setDate={setDate} />
					</div>
					<div className="flex flex-row items-center gap-2 w-full">
						<Select
							radius="none"
							variant="bordered"
							className="min-w-30 max-w-64"
							disallowEmptySelection
							selectionMode="multiple"
							value={selectedValues}
							selectedKeys={selectedValues}
							onChange={(e) => {
								const values = e.target.value.split(",");
								setSelectedValues(values);
								table.getAllColumns().map((column) => {
									column.toggleVisibility(values.includes(column.id));
								});
							}}
						>
							{table.getAllColumns().map((column) => {
								return (
									<SelectItem
										key={column.id}
										value={column.id}
										className="capitalize"
									>
										{column.id}
									</SelectItem>
								);
							})}
						</Select>
						{filters.map((f) => {
							return (
								<Input
									radius="none"
									key={f.label}
									label={f.label}
									variant="bordered"
									className="max-w-md"
									value={
										(table.getColumn(f.column)?.getFilterValue() as string) ??
										""
									}
									onChange={(event) => {
										table
											.getColumn(f.column)
											?.setFilterValue(event.target.value);
									}}
								/>
							);
						})}
					</div>
				</div>
				<p className="underline text-lg font-bold my-4">Preview of the page:</p>
				<div className="overflow-x-auto">
					<div ref={componentRef} className="w-full h-full flex justify-start">
						<RaportBody title={title} table={table} columns={columns} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(TableRaport);
