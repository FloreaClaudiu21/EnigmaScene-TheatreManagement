"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	ChevronDown,
	File,
	FilterIcon,
	PlusCircle,
	SearchIcon,
	TrashIcon,
} from "lucide-react";
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
import {
	deleteQueryParam,
	filterListByKeysAndValues,
	handlePredefinedDateChange,
	isDateString,
	parseQueryParams,
	setQueryParams,
	urlLink,
} from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTablePagination } from "./TablePagination";
import { useToast } from "@/components/ui/use-toast";
import { remove } from "@/services/admin/ControlProvider";
import { useLoadingScreen, useRaportModal } from "@/services/StateProvider";
import { getCookie } from "cookies-next";
import { TipuriTabel } from "@/lib/types";
import { Chip, Divider, Input } from "@nextui-org/react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

export type TableFilterMap = {
	date: DateRange | undefined;
	filters: FilterMap[];
};

export type FilterMap = {
	value?: string;
	column: string;
	label: string;
};

export default function DataTable({
	type,
	data,
	columns,
	title,
	subtitle,
	create_link,
	filters,
	showControlBtns,
}: {
	data: any[];
	type: TipuriTabel;
	title: string;
	subtitle: string;
	create_link: string;
	showControlBtns: boolean;
	columns: ColumnDef<any>[];
	filters: FilterMap[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const pathName = usePathname();
	const raportModal = useRaportModal();
	const searchParams = useSearchParams();
	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date("01.01.2024"),
		to: new Date(),
	});
	useEffect(() => {
		const toParam = searchParams.get("to");
		const fromParam = searchParams.get("from");
		const fromDateObj = isDateString(fromParam ?? "");
		const toDateObj = isDateString(toParam ?? "");
		const fromDate = fromDateObj.check
			? fromDateObj.date!
			: new Date("01.01.2024");
		const toDate = toDateObj.check ? toDateObj.date! : new Date();
		setDate({ from: fromDate, to: toDate });
	}, [searchParams]);
	const filledArray = new Array(filters.length).fill({
		column: "",
		label: "",
		value: "",
	});
	const mappedArrayWithIndex: FilterMap[] = filledArray.map((item, index) => {
		const column = filters[index].column;
		const value = searchParams.get(column) ?? "";
		return {
			...item,
			column: column,
			label: filters[index].label,
			value: value,
		};
	});
	const finalMap: TableFilterMap = {
		date: date,
		filters: mappedArrayWithIndex,
	};
	const pageSize = getCookie("tableSize") ?? "10";
	const { loading, setLoading } = useLoadingScreen();
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [inputValues, setInputValues] = useState<TableFilterMap>(finalMap);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const filteredData = useMemo(() => {
		const stripTime = (date: Date): Date => {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate());
		};
		return data.filter((item: any) => {
			const dateD = new Date();
			const toDate = stripTime(date?.to ?? dateD);
			const fromDate = stripTime(date?.from ?? dateD);
			const itemDate = stripTime(new Date(item.creatPe));
			return itemDate >= fromDate && itemDate <= toDate;
		});
	}, [data, date]);
	const filterCriteria = useMemo(() => {
		return parseQueryParams(searchParams, finalMap.filters);
	}, [searchParams, finalMap.filters]);
	const newList = useMemo(() => {
		return filterListByKeysAndValues(filteredData, searchParams);
	}, [searchParams, filteredData]);
	const table = useReactTable({
		data: newList,
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
	useEffect(() => {
		table.setPageSize(parseInt(pageSize));
	}, [pageSize]);
	const handleInputChange = (index: number, value: any, filter: FilterMap) => {
		const newInputValues = [...inputValues.filters];
		newInputValues[index] = {
			column: filter.column,
			label: filter.label,
			value: value,
		};
		console.log(newInputValues);
		setInputValues({
			date: inputValues.date,
			filters: newInputValues,
		});
	};
	const handleDateChange = (date: DateRange | undefined) => {
		setInputValues({
			date: date,
			filters: inputValues.filters,
		});
	};
	const deleteMultiple = async () => {
		setLoading(true);
		const selectedRows = table.getSelectedRowModel().rows;
		if (selectedRows.length <= 0) {
			toast({
				title: "Ștergere în masă",
				description: "Nu au fost selectate rânduri!",
			});
			setLoading(false);
			return;
		}
		const promises = table.getSelectedRowModel().rows.map(async (v) => {
			const rowOriginal = v.original;
			const codField =
				Object.keys(rowOriginal).find((key) => key.startsWith("cod")) ?? "id";
			const codValue = rowOriginal[codField];
			return await remove(type, codValue);
		});
		const responses = await Promise.all(promises);
		const errors = responses.filter((v) => !v?.ok);
		if (errors.length > 0) {
			toast({
				title: "Ștergere în masă",
				variant: "destructive",
				description: "Unele înregistrări nu au putut fi șterse!",
			});
		} else {
			toast({
				title: "Ștergere în masă",
				description: "Toate înregistrările au fost șterse!",
			});
		}
		router.refresh();
		setLoading(false);
	};
	return (
		<div className="my-4 flex flex-col h-full">
			<Card>
				<CardHeader className="flex flex-col gap-2 md:flex-row">
					<div className="flex flex-col gap-2 flex-1">
						<div className="flex flex-col gap-2">
							<CardTitle>{title}</CardTitle>
							<CardDescription>{subtitle}</CardDescription>
						</div>
						<div className="flex-1 flex flex-wrap place-items-center gap-1">
							{filterCriteria.map((filter) => {
								return (
									<Chip
										size="sm"
										key={filter.label}
										color="secondary"
										onClose={() => {
											const url = deleteQueryParam(filter.column, searchParams);
											const newValues = inputValues.filters.map((v) =>
												v.column === filter.column ? { ...v, value: "" } : v
											);
											setInputValues({
												date: inputValues.date,
												filters: newValues,
											});
											router.replace(pathName + "?" + url, {
												scroll: false,
											});
										}}
										className="gap-2 shadow-md bg-primary dark:bg-secondary text-gray-100 dark:text-secondary-foreground"
									>
										{filter.label}
									</Chip>
								);
							})}
						</div>
					</div>
					<div className="flex flex-col gap-4 place-items-end justify-center">
						<div className="flex flex-row gap-2 justify-end">
							<Sheet>
								<SheetTrigger asChild>
									<Button
										size="sm"
										variant="outline"
										className="h-8 gap-1 rounded-md ml-auto"
									>
										<FilterIcon className="h-3.5 w-3.5" />
										<span className="sm:whitespace-nowrap">Filtre</span>
									</Button>
								</SheetTrigger>
								<SheetContent className="z-[99999] overflow-y-auto">
									<SheetHeader>
										<SheetTitle>Editare Filtre</SheetTitle>
										<SheetDescription>
											Efectuați modificări ale filtrelor dvs. aici. Apăsați
											`Cauta` când ați terminat.
										</SheetDescription>
									</SheetHeader>
									<div className="flex flex-col gap-4 py-4 ">
										<div className="flex flex-col gap-2">
											<DatePickerWithRange
												date={inputValues.date}
												setDate={(e: any) => handleDateChange(e)}
											/>
											<div className="flex flex-row gap-2 flex-wrap">
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("today")
														)
													}
												>
													Astăzi
												</Button>
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("lastDay")
														)
													}
												>
													O zi în urmă
												</Button>
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("last7Days")
														)
													}
												>
													Ultimele 7 zile
												</Button>
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("last30Days")
														)
													}
												>
													Ultimele 30 de zile
												</Button>
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("last60Days")
														)
													}
												>
													Ultimele 60 de zile
												</Button>
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("last90Days")
														)
													}
												>
													Ultimele 90 de zile
												</Button>
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("last6Months")
														)
													}
												>
													Ultimele 6 luni
												</Button>
												<Button
													size={"sm"}
													variant={"secondary"}
													className="text-[12px] shadow-sm p-1 h-6"
													onClick={() =>
														handleDateChange(
															handlePredefinedDateChange("last9Months")
														)
													}
												>
													Ultimele 9 luni
												</Button>
											</div>
										</div>
										<Divider />
										{filters.map((filter, index) => {
											return (
												<div key={filter.column}>
													<Input
														type="text"
														variant="bordered"
														label={filter.label}
														className={"field field_" + filter.column}
														placeholder={`Filtrează după '${filter.column}'`}
														value={inputValues.filters[index].value}
														onChange={(e) =>
															handleInputChange(index, e.target.value, filter)
														}
													/>
												</div>
											);
										})}
									</div>
									<SheetFooter>
										<SheetClose asChild>
											<Link
												href={
													pathName +
													"?" +
													setQueryParams(searchParams, inputValues)
												}
											>
												<Button className="flex flex-row gap-2">
													<SearchIcon size={14} />
													Caută
												</Button>
											</Link>
										</SheetClose>
									</SheetFooter>
								</SheetContent>
							</Sheet>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="h-8">
										Coloane <ChevronDown className="ml-2 h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="max-h-60 overflow-y-auto"
								>
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
								onClick={() => {
									raportModal.setRaport(table);
									raportModal.setVisible(true);
								}}
								className="h-8 gap-1 shadow-sm rounded-md hover:bg-yellow-100"
							>
								<File className="h-3.5 w-3.5" />
								<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
									Export
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
											Ștergere multiplă
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
												Adăugare
											</span>
										</Button>
									</Link>
								</>
							)}
						</div>
						<div className="flex flex-1  flex-row gap-2 justify-center place-items-center">
							<div className="text-sm text-muted-foreground">
								Pagina{" "}
								<strong>{table.getState().pagination.pageIndex + 1}</strong> din{" "}
								<strong>
									{table.getPageCount() <= 0
										? table.getPageCount() + 1
										: table.getPageCount()}
								</strong>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Inapoi
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Inainte
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup: any) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header: any) => {
										return (
											<TableHead
												key={header.id}
												className="px-1 w-auto min-w-0"
											>
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
											<TableCell
												key={cell.id}
												className="px-1 max-w-[120px] w-auto min-w-0"
											>
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
										className="h-24 text-center text-sm"
									>
										Nu au fost găsite rezultate.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter className="flex flex-col md:flex-row gap-1">
					<div className="flex w-full md:w-auto place-items-start md:place-items-center text-xs text-muted-foreground text-left gap-1">
						Arată{" "}
						<strong>
							{data.length > 0
								? "1-" + table.getState().pagination.pageSize
								: "0"}
						</strong>{" "}
						din <strong>{newList.length}</strong> {title.toLowerCase()}
					</div>
					<DataTablePagination table={table} />
				</CardFooter>
			</Card>
		</div>
	);
}
{
	/* 
			<div className="ml-auto flex items-center flex-wrap gap-4">
				{/* <div className="flex items-center gap-2 z-50 flex-wrap md:flex-nowrap">
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
										Caută după
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="max-h-60 overflow-y-auto"
							>
								<DropdownMenuLabel>Caută după</DropdownMenuLabel>
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
							title={selectedFilter.label}
							className="min-w-64 h-8 text-sm rounded-md"
							placeholder={`Caută după ${selectedFilter.label}...`}
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
			</div>*/
}
