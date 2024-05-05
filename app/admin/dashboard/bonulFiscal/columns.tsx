"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import { BonFiscal } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";

export const columnsReceipts: ColumnDef<BonFiscal>[] = [
	{
		id: "actions",
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2 place-items-center flex-wrap">
					<ModalViewInvoice invoice={original.factura} />
					<ModalViewFiscalReceipt receipt={original} />
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Bon Fiscal" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codBonFiscal} />;
		},
	},
	{
		accessorKey: "numarBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Bon" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.numarBonFiscal} />;
		},
	},
	{
		accessorKey: "serieBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Serie Bon" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.serieBonFiscal} />;
		},
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Plata" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.codPlata} />;
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
		accessorKey: "codSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Spectacol" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.codClient} />;
		},
	},
	{
		accessorKey: "numeSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Spectacol" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.spectacol?.titlu} />;
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Bon Emis Pe" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={formatDateFull(original.creatPe)} />;
		},
	},
];
