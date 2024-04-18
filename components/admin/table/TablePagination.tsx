import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
	return (
		<div className="flex-1 w-full flex flex-row flex-wrap items-center justify-end gap-2">
			<div className="text-xs text-muted-foreground">
				<strong>{table.getFilteredSelectedRowModel().rows.length}</strong> of{" "}
				<strong>{table.getFilteredRowModel().rows.length}</strong> row(s)
				selected.
			</div>
			<div className="flex flex-wrap items-center justify-end gap-2">
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger className="h-8 w-[70px]">
						<SelectValue placeholder={table.getState().pagination.pageSize} />
					</SelectTrigger>
					<SelectContent side="top">
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
				<div className="text-xs text-muted-foreground">
					Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
					<strong>
						{table.getPageCount() <= 0
							? table.getPageCount() + 1
							: table.getPageCount()}
					</strong>
				</div>
			</div>
		</div>
	);
}
