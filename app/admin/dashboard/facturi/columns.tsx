"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell, { PushFilter } from "@/components/admin/table/ColumnCell";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { FacturaFiscala, TipuriTabel } from "@/lib/types";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter } from "@/lib/utils";

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
		accessorKey: "numarFactura",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Factura" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "facturi",
							label: "Numar Factura",
							column: "numarFactura",
							value: original.numarFactura ?? "",
						},
					]}
					data={original.numarFactura}
				/>
			);
		},
	},
	{
		accessorKey: "dataIntocmiri",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Data Intocmirii" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "facturi",
							label: "Data Intocmirii",
							column: "dataIntocmiri",
							value: formatDate(original.dataIntocmiri) ?? "",
						},
					]}
					data={capitalizeFirstLetter(formatDateFull(original.dataIntocmiri))}
				/>
			);
		},
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Plata" />;
		},
		cell: ({ row }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "facturi",
							label: "Cod Plata",
							column: "codPlata",
							value: row.original.codPlata + "" ?? "",
						},
					]}
					data={row.original.codPlata}
				/>
			);
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
					filters={[
						{
							page: "facturi",
							label: "Moneda",
							column: "moneda",
							value: original.plata?.rataDeSchimbValutar?.moneda ?? "",
						},
					]}
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
		accessorKey: "codBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod & Nr. Bon Fiscal" />;
		},
		cell: ({ row }) => {
			return (
				<ColumnCell
					data={
						<>
							<PushFilter
								filters={[
									{
										page: "facturi",
										column: "codBonFiscal",
										label: "Cod Bon Fiscal",
										value: row.original.codBonFiscal + "" ?? "",
									},
								]}
							>
								{row.original.codBonFiscal}
							</PushFilter>
							-
							<PushFilter
								filters={[
									{
										page: "facturi",
										column: "numarBonFiscal",
										label: "Numar Bon Fiscal",
										value: row.original.bonFiscal?.numarBonFiscal ?? "",
									},
								]}
							>
								{row.original.bonFiscal?.numarBonFiscal}
							</PushFilter>
						</>
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
			return (
				<ColumnCell
					filters={[
						{
							column: "codClient",
							label: "Cod Client",
							page: "facturi",
							value: original.codClient + "" ?? "",
						},
					]}
					data={original.codClient}
				/>
			);
		},
	},
	{
		accessorKey: "bileteVandute",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Bilete Asociate" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "bilete",
							label: "Bilete Asociate",
							column: "codFactura",
							value: original.codFactura + "",
						},
					]}
					data={original.bileteSpectacol?.length ?? 0}
				/>
			);
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
						<div className="flex flex-row flex-wrap justify-center">
							<PushFilter
								filters={[
									{
										column: "numeClient",
										label: "Nume Client",
										page: "facturi",
										value: original.numeClient ?? "",
									},
								]}
							>
								{original.numeClient}
							</PushFilter>
							,
							<PushFilter
								filters={[
									{
										column: "email",
										page: "facturi",
										label: "Email Client",
										value: original.email ?? "",
									},
								]}
							>
								{original.email}
							</PushFilter>
							,
							<PushFilter
								filters={[
									{
										column: "telefon",
										label: "Telefon",
										page: "facturi",
										value: original.telefon ?? "",
									},
								]}
							>
								{original.telefon}
							</PushFilter>
							,
							<PushFilter
								filters={[
									{
										page: "facturi",
										column: "adresaFacturare",
										label: "Adresa Facturare",
										value: original.adresaFacturare ?? "",
									},
								]}
							>
								{original.adresaFacturare}
							</PushFilter>
						</div>
					}
				/>
			);
		},
	},
];
