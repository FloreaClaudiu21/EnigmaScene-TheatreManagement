"use client";
import React, { useMemo, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	ChevronDown,
	File,
	PlusCircle,
	SearchIcon,
	TrashIcon,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { urlLink } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { DataTablePagination } from "./TablePagination";
import { useToast } from "@/components/ui/use-toast";
import { TableTypes } from "@/lib/types";
import { deleteClient } from "@/services/admin/ClientsProvider";
import { CircularProgress } from "@nextui-org/react";
import {
	deleteCategory,
	deleteDistribution,
	deleteSeason,
} from "@/services/admin/ShowsProvider";

type FilterMap = {
	label: string;
	column: string;
};

export default function DataTable({
	type,
	data,
	columns,
	filters,
	title,
	subtitle,
	create_link,
	create_title,
	showControlBtns,
	params,
}: {
	data: any[];
	type: TableTypes;
	title: string;
	subtitle: string;
	create_title: string;
	create_link: string;
	showControlBtns: boolean;
	columns: ColumnDef<any>[];
	filters: FilterMap[];
	params: any;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const pathName = usePathname();
	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date("01.01.2024"),
		to: new Date(),
	});
	const [loading, setLoading] = useState(false);
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedFilter, setSelectedFilter] = useState(filters[0]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const filteredData = useMemo(() => {
		return data.filter((item: any) => {
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
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
	});
	const deleteMultiple = async () => {
		setLoading(true);
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length <= 0) {
			toast({
				title: "Delete multiple records",
				description: "No rows have been selected!",
			});
			setLoading(false);
			return;
		}
		const promises = table.getSelectedRowModel().rows.map(async (v) => {
			const rowOriginal = v.original;
			const id = rowOriginal.id;
			switch (type) {
				case TableTypes.CLIENTS: {
					return await deleteClient(params.lang, id);
				}
				case TableTypes.SHOWS_CATEGORY: {
					return await deleteCategory(params.lang, id);
				}
				case TableTypes.SHOWS_DISTRIBUTION: {
					return await deleteDistribution(params.lang, id);
				}
				case TableTypes.SHOWS_SEASON: {
					return await deleteSeason(params.lang, id);
				}
			}
		});
		const responses = await Promise.all(promises);
		const errors = responses.filter((v) => !v?.ok);
		if (errors.length > 0) {
			toast({
				title: "Delete multiple records",
				variant: "destructive",
				description: "Some records couldnt be deleted!",
			});
		} else {
			toast({
				title: "Delete multiple records",
				description: "All the records have been deleted!",
			});
		}
		router.refresh();
		setLoading(false);
	};
	return (
		<>
			{loading && (
				<div className="absolute flex flex-col gap-4 justify-center place-items-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)] z-[999999]">
					<CircularProgress color="primary" />
					<p className="text-base text-white font-bold">Loading...</p>
				</div>
			)}
			<div className="ml-auto flex items-center flex-wrap gap-4">
				<div className="flex items-center gap-2 z-50 flex-wrap md:flex-nowrap">
					<DatePickerWithRange
						date={date}
						setDate={setDate}
						className="w-full md:w-auto"
					/>
					<div className="flex flex-row gap-2 place-items-center w-full md:w-auto">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="sm"
									variant="outline"
									className="h-8 gap-1 rounded-md"
								>
									<SearchIcon className="h-3.5 w-3.5" />
									<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
										Search By
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Search By</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{filters.map((v) => {
									return (
										<DropdownMenuCheckboxItem
											key={v.label}
											onCheckedChange={(c) => {
												if (c) {
													table
														.getColumn(selectedFilter.column)
														?.setFilterValue(undefined);
													setSelectedFilter(v);
												}
											}}
											checked={v.label == selectedFilter.label}
										>
											{v.label}
										</DropdownMenuCheckboxItem>
									);
								})}
							</DropdownMenuContent>
						</DropdownMenu>
						<Input
							className="min-w-64 h-8 text-sm rounded-md"
							placeholder={`Search by ${selectedFilter.label}...`}
							value={
								(table
									.getColumn(selectedFilter.column)
									?.getFilterValue() as string) ?? ""
							}
							onChange={(event) => {
								table
									.getColumn(selectedFilter.column)
									?.setFilterValue(event.target.value);
							}}
						/>
					</div>
				</div>
				<div className="flex-1 flex flex-row gap-2 justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="h-8 ml-auto">
								Columns <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						size="sm"
						variant="outline"
						disabled={loading}
						className="h-8 gap-1 shadow-sm rounded-md hover:bg-yellow-100"
					>
						<File className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							Export Raport
						</span>
					</Button>
					{showControlBtns && (
						<>
							<Button
								size="sm"
								disabled={loading}
								variant="destructive"
								onClick={() => deleteMultiple()}
								className="h-8 gap-1 shadow-sm rounded-md hover:bg-red-800"
							>
								<TrashIcon className="h-3.5 w-3.5" />
								<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
									Delete Multiple
								</span>
							</Button>
							<Link href={urlLink(pathName) + create_link}>
								<Button
									size="sm"
									className="h-8 gap-1 shadow-sm"
									disabled={loading}
								>
									<PlusCircle className="h-3.5 w-3.5" />
									<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
										{create_title}
									</span>
								</Button>
							</Link>
						</>
					)}
				</div>
			</div>
			<div className="mt-4 flex flex-col h-full">
				<Card>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{subtitle}</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup: any) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header: any) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext()
														  )}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row: any) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell: any) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No results found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter>
						<div className="text-xs text-muted-foreground">
							Showing{" "}
							<strong>
								{data.length > 0
									? "1-" + table.getState().pagination.pageSize
									: "0"}
							</strong>{" "}
							of <strong>{filteredData.length}</strong> {title.toLowerCase()}
						</div>
						<DataTablePagination table={table} />
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
