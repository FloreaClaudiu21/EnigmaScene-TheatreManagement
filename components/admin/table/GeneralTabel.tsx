"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getCookie } from "cookies-next";
import {
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
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
import {
  esteStringData,
  filtreazaListaDupaCheiSiValori,
  gestioneazaSchimbareaDateiPredefinite,
  linkURL,
  parseazaParametriiQuery,
  seteazaParametriiQuery,
  stergeParametruQuery,
} from "@/lib/metodeUtile";
import {
  ecranIncarcare,
  formularRaport,
} from "@/services/general/FurnizorStare";
import {
  ArrayIntervaleSelectare,
  ListaIntervaleSelectare,
  TipuriTabel,
} from "@/lib/tipuri";
import { sterge } from "@/services/backend/GeneralController";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectScrollDownButton } from "@radix-ui/react-select";

export type TableFilterMap = {
  date: DateRange | undefined;
  filters: FilterMap[];
};

export type FilterMap = {
  value?: string;
  column: string;
  label: string;
};

export default function GeneralTabel({
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
  const raportModal = formularRaport();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date("01.01.2024"),
    to: new Date(),
  });
  useEffect(() => {
    const toParam = searchParams.get("to");
    const fromParam = searchParams.get("from");
    const fromDateObj = esteStringData(fromParam ?? "");
    const toDateObj = esteStringData(toParam ?? "");
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
  const { incarcare, setIncarcare } = ecranIncarcare();
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
    return parseazaParametriiQuery(searchParams, finalMap.filters);
  }, [searchParams, finalMap.filters]);
  const newList = useMemo(() => {
    return filtreazaListaDupaCheiSiValori(filteredData, searchParams);
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
    setIncarcare(true);
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length <= 0) {
      toast({
        title: "Ștergere înregistrări",
        description: "Nu au fost selectat nimic!",
      });
      setIncarcare(false);
      return;
    }
    const promises = table.getSelectedRowModel().rows.map(async (v) => {
      const rowOriginal = v.original;
      const codField =
        Object.keys(rowOriginal).find((key) => key.startsWith("cod")) ?? "cod";
      const codValue = rowOriginal[codField];
      return await sterge(type, codValue);
    });
    const responses = await Promise.all(promises);
    const errors = responses.filter((v) => !v?.ok);
    if (errors.length > 0) {
      toast({
        title: "Ștergere înregistrări",
        variant: "destructive",
        description: "Unele înregistrări nu au putut fi șterse!",
      });
    } else {
      toast({
        title: "Ștergere înregistrări",
        description: "Toate înregistrările au fost șterse!",
      });
    }
    table.toggleAllPageRowsSelected(false);
    router.refresh();
    setIncarcare(false);
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
                    radius="none"
                    key={filter.eticheta}
                    color="primary"
                    onClose={() => {
                      const url = stergeParametruQuery(
                        filter.coloana,
                        searchParams
                      );
                      const newValues = inputValues.filters.map((v) =>
                        v.column === filter.coloana ? { ...v, value: "" } : v
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
                    {filter.eticheta}
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
                        {ListaIntervaleSelectare.map(
                          (v: ArrayIntervaleSelectare) => {
                            return (
                              <Button
                                size={"sm"}
                                key={v.coloane}
                                color="secondary"
                                className="shadow-sm h-5 text-red-500 bg-white hover:text-white"
                                onClick={() =>
                                  handleDateChange(
                                    gestioneazaSchimbareaDateiPredefinite(
                                      v.value
                                    )
                                  )
                                }
                              >
                                {v.coloane}
                              </Button>
                            );
                          }
                        )}
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
                          seteazaParametriiQuery(searchParams, inputValues)
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
                disabled={incarcare || table.getCoreRowModel().rows.length <= 0}
                onClick={() => {
                  raportModal.setRaport(table);
                  raportModal.setVizibil(true);
                }}
                className="h-8 gap-1 shadow-sm rounded-md hover:bg-yellow-100"
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Raport
                </span>
              </Button>
              {showControlBtns && (
                <>
                  <Divider orientation="vertical" />
                  <Button
                    size="sm"
                    disabled={incarcare}
                    variant="destructive"
                    onClick={() => deleteMultiple()}
                    className="h-8 gap-1 shadow-sm rounded-md hover:bg-red-800"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Ștergere multiplă
                    </span>
                  </Button>
                  <Link href={linkURL(pathName) + create_link}>
                    <Button
                      size="sm"
                      className="h-8 gap-1 shadow-sm"
                      disabled={incarcare}
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
                        className="px-1 max-w-[120px] text-center w-auto min-w-0"
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
      </Card>
    </div>
  );
}
