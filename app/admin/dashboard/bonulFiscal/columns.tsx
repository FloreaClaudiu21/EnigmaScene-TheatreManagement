"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell, { PushFilter } from "@/components/admin/table/ColumnCell";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import { BonFiscal } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

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
			return (
				<ColumnCell
					filters={[
						{
							page: "bonulFiscal",
							label: "Cod Bon Fiscal",
							column: "codBonFiscal",
							value: user.codBonFiscal + "" ?? "",
						},
					]}
					data={user.codBonFiscal}
				/>
			);
		},
	},
	{
		accessorKey: "numarBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Bon" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "bonulFiscal",
							label: "Numar Bon Fiscal",
							column: "numarBonFiscal",
							value: original.numarBonFiscal + "" ?? "",
						},
					]}
					data={original.numarBonFiscal}
				/>
			);
		},
	},
	{
		accessorKey: "serieBonFiscal",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Serie Bon" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "bonulFiscal",
							label: "Serie Bon Fiscal",
							column: "serieBonFiscal",
							value: original.serieBonFiscal + "" ?? "",
						},
					]}
					data={original.serieBonFiscal}
				/>
			);
		},
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Plata & Suma Platită" />;
		},
		cell: ({ row: { original } }) => {
			let priceConverted = original.plata?.sumaPlatita ?? 0;
			return (
				<ColumnCell
					data={
						<>
							<PushFilter
								filters={[
									{
										column: "codPlata",
										label: "Cod Plata",
										page: "bonulFiscal",
										value: original.codPlata + "" ?? "",
									},
								]}
							>
								{original.codPlata}
							</PushFilter>
							-
							<PushFilter
								filters={[
									{
										column: "moneda",
										page: "bonulFiscal",
										label: "Moneda",
										value: priceConverted.toFixed(2) ?? "",
									},
								]}
							>
								{priceConverted.toFixed(2) + " RON"}
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
										page: "bonulFiscal",
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
										page: "bonulFiscal",
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
		accessorKey: "codSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod & Nume Spectacol" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						<>
							<PushFilter
								filters={[
									{
										column: "codSpectacol",
										label: "Cod Spectacol",
										page: "bonulFiscal",
										value: original.codSpectacol + "" ?? "",
									},
								]}
							>
								{original.codSpectacol}
							</PushFilter>
							-
							<PushFilter
								filters={[
									{
										column: "titlu",
										page: "bonulFiscal",
										label: "Titlu Spectacol",
										value: original.spectacol?.titlu ?? "",
									},
								]}
							>
								{original.spectacol?.titlu}
							</PushFilter>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "bileteVandute",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Bilete Vandute" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "bilete",
							label: "Bilete Vandute",
							column: "codSpectacol",
							value: original.codSpectacol + "",
						},
						{
							page: "bilete",
							label: "Bilete Vandute",
							column: "titlu",
							value: original.spectacol?.titlu ?? "",
						},
					]}
					data={
						(original.bileteSpectacol?.length ?? 0) +
						"/" +
						original.spectacol?.salaSpectacol?.locuriSala?.length
					}
				/>
			);
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Bon Emis Pe" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "bilete",
							label: "Emis Pe",
							column: "creatPe",
							value: formatDate(original.creatPe),
						},
					]}
					data={capitalizeFirstLetter(formatDateFull(original.creatPe))}
				/>
			);
		},
	},
];
