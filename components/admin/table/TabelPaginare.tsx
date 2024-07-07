import { Table } from "@tanstack/react-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { setCookie } from "cookies-next";

export function TabelPaginare<TData>({ table }: { table: Table<TData> }) {
	return (
		<div className="flex-1 w-full flex flex-row flex-wrap items-center justify-end gap-2">
			<div className="text-xs text-muted-foreground">
				<strong>{table.getFilteredSelectedRowModel().rows.length}</strong> din{" "}
				<strong>{table.getFilteredRowModel().rows.length}</strong> rand(uri)
				selectate.
			</div>
			<div className="flex flex-wrap items-center justify-end gap-2">
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
						setCookie("tableSize", value);
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
			</div>
		</div>
	);
}
