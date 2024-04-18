import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import RaportHeader from "./RaportHeader";
import { flexRender } from "@tanstack/react-table";

const RaportBody = ({
	table,
	columns,
	title,
}: {
	table: any;
	columns: any;
	title: string;
}) => {
	console.log("raportContainer - Render");
	return (
		<div className="border-1">
			<style type="text/css" media="print">
				{`
          @page {
						size: A4;
						margin: 0px 0 50px 0;
					}
					html, body {
						height: 100%;
						margin: 0 !important;
						padding: 0 !important;
						overflow: initial !important;
					}
        `}
			</style>
			<div className="flex flex-col w-[210mm] max-w-[210mm] min-h-[210mm]">
				<div className="page">
					<RaportHeader title={title} />
					<div className="rounded-none border mx-6">
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default RaportBody;
