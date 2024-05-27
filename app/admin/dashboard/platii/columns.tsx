"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell, { PushFilter } from "@/components/admin/table/ColumnCell";
import { Chip } from "@nextui-org/react";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import { Plata } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";
import { StarePlata } from "@prisma/client";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

export const columnsPayments: ColumnDef<Plata>[] = [
	{
		id: "actions",
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2 place-items-center">
					<ModalViewInvoice invoice={original.factura} />
					<ModalViewFiscalReceipt receipt={original.bonFiscal} />
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Plata" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<ColumnCell
					filters={[
						{
							page: "platii",
							label: "Cod Plata",
							column: "codPlata",
							value: user.codPlata + "" ?? "",
						},
					]}
					data={user.codPlata}
				/>
			);
		},
	},
	{
		accessorKey: "codClient",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod & Nume Client" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						<>
							<PushFilter
								filters={[
									{
										column: "codClient",
										label: "Cod Client",
										page: "platii",
										value: original.codClient + "" ?? "",
									},
								]}
							>
								{original.codClient}
							</PushFilter>
							-
							<PushFilter
								filters={[
									{
										column: "numeClient",
										page: "platii",
										label: "Nume Client",
										value: original.client?.numeClient ?? "",
									},
								]}
							>
								{original.client?.numeClient}
							</PushFilter>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "sumaPlatita",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Suma Platita (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "platii",
							label: "Suma Platita",
							column: "sumaPlatita",
							value: original.sumaPlatita + "" ?? "",
						},
					]}
					data={original.sumaPlatita}
				/>
			);
		},
	},
	{
		accessorKey: "sumaPlatitaCur",
		header: ({ column }) => {
			return <ColumnHeader column={column} title={`Suma Platita in Moneda`} />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "platii",
							label: "Moneda",
							column: "moneda",
							value: original.rataDeSchimbValutar?.moneda ?? "",
						},
					]}
					data={
						(original.rataDeSchimbValutar?.moneda != "RON"
							? original.sumaPlatita /
							  (original.rataDeSchimbValutar?.valuare ?? 1)
							: original.sumaPlatita
						).toFixed(2) +
						" " +
						original.rataDeSchimbValutar?.moneda
					}
				/>
			);
		},
	},
	{
		accessorKey: "platitPe",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Platit Pe" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "platii",
							label: "Platit Pe",
							column: "platitPe",
							value: formatDate(original.platitPe),
						},
					]}
					data={capitalizeFirstLetter(formatDateFull(original.platitPe))}
				/>
			);
		},
	},
	{
		accessorKey: "tipPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Tip Plata" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "platii",
							label: "Tip Plata",
							column: "tipPlata",
							value: original.tipPlata.toString(),
						},
					]}
					data={original.tipPlata}
				/>
			);
		},
	},
	{
		accessorKey: "starePlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Stare Plata" />;
		},
		cell: ({ row }) => {
			const color =
				row.original.starePlata == StarePlata.ACCEPTATA ? "success" : "danger";
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Chip variant="flat" color={color}>
						{color != "danger" ? "Aceptată" : "Refuzată"}
					</Chip>
				</div>
			);
		},
	},
];
