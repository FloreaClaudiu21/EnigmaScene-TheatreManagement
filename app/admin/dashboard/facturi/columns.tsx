"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { FacturaFiscala, TipuriTabel } from "@/lib/types";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";

export const columnsInvoice: ColumnDef<FacturaFiscala>[] = [
	{
		id: "select",
		header: ({ table }) => {
			return <ColumnSelectHeader table={table} />;
		},
		cell: ({ row }) => {
			return <ColumnSelectCell row={row} />;
		},
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2">
					<div className="flex flex-row gap-2 place-items-center">
						<ModalViewInvoice invoice={original} />
						<ModalViewFiscalReceipt receipt={original.bonFiscal} />
					</div>
					<ColumnCellActions
						deleteId={original.codFactura}
						type={TipuriTabel.FACTURA_FISCALA}
						link_edit={"facturi/" + original.codFactura + "/editare"}
					/>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codFactura",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Factura" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codFactura} />;
		},
	},
	{
		accessorKey: "numarFactura",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Factura" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.numarFactura} />;
		},
	},
	{
		accessorKey: "dataIntocmiri",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Data Intocmirii" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={formatDateFull(original.dataIntocmiri)} />;
		},
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="codPlata" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.codPlata} />;
		},
	},
	{
		accessorKey: "codBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Bon Fiscal" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.codBonFiscal} />;
		},
	},
	{
		accessorKey: "numarBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Bon Fiscal" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.bonFiscal?.numarBonFiscal} />;
		},
	},
	{
		accessorKey: "sumaPlatita",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Suma Platita" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						(original.plata?.rataDeSchimbValutar?.moneda != "RON"
							? (original.sumaPlatita + original.costuriExtra) /
							  (original.plata?.rataDeSchimbValutar?.valuare ?? 1)
							: original.sumaPlatita + original.costuriExtra
						).toFixed(2) +
						" " +
						original.plata?.rataDeSchimbValutar?.moneda
					}
				/>
			);
		},
	},
	{
		accessorKey: "codClient",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Client" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.codClient} />;
		},
	},
	{
		accessorKey: "numeClient",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Client" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.client?.numeClient} />;
		},
	},
	{
		accessorKey: "adresaFacturare",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Detalii Facturare" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.numeClient +
						", " +
						original.email +
						", " +
						original.telefon +
						", " +
						original.adresaFacturare
					}
				/>
			);
		},
	},
];
