"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell, { PushFilter } from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { BiletSpectacol, TipuriTabel } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewTicket from "@/components/page/ticket/ViewTicketBtn";
import { formatDateFull } from "@/lib/rangeOptions";
import { Checkbox } from "@nextui-org/react";
import { verifyTicket } from "@/services/admin/ControlProvider";
import { useOptimistic, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

const VerifyComponent = ({ bilet }: { bilet: BiletSpectacol }) => {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [checked, setChecked] = useOptimistic(bilet.biletVerificat);
	const verifyMethod = async () => {
		if (isPending) return;
		setChecked(!bilet.biletVerificat);
		const response = await verifyTicket(bilet);
		if (!response.ok) {
			toast({
				title: "Verificare bilet la spectacol",
				description:
					"A apărut o eroare necunoscută în timpul verificari biletului. Vă rugăm să încercați din nou mai târziu.",
			});
		}
	};
	return (
		<div className="flex flex-row items-center justify-center text-center break-all">
			<Checkbox
				isSelected={checked}
				value={checked + ""}
				onValueChange={() => {
					startTransition(() => verifyMethod());
				}}
			/>
		</div>
	);
};

export const columnsTicketsSold: ColumnDef<BiletSpectacol>[] = [
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
				<div className="flex flex-row gap-2 flex-wrap">
					<div className="flex flex-row gap-2 place-items-center">
						<ModalViewInvoice invoice={original.factura} />
						<ModalViewFiscalReceipt receipt={original.bonFiscal} />
						<ModalViewTicket ticket={original} />
					</div>
					<ColumnCellActions
						deleteId={original.codBiletSpectacol}
						type={TipuriTabel.BILET}
						link_edit={"bilete/" + original.codBiletSpectacol + "/editare"}
					/>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "verificareBilet",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Bilet Verificat" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <VerifyComponent bilet={user} />;
		},
	},
	{
		accessorKey: "codBiletSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Bilet Spectacol" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<ColumnCell
					filters={[
						{
							page: "bilete",
							label: "Cod Bilet Spectacol",
							column: "codBiletSpectacol",
							value: user.codBiletSpectacol + "" ?? "",
						},
					]}
					data={user.codBiletSpectacol}
				/>
			);
		},
	},
	{
		accessorKey: "numarBilet",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Bilet" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "bilete",
							label: "Numar Bilet",
							column: "numarBilet",
							value: original.numarBilet + "" ?? "",
						},
					]}
					data={original.numarBilet}
				/>
			);
		},
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Plata & Preț Bilet" />;
		},
		cell: ({ row: { original } }) => {
			const cur = original.plata?.rataDeSchimbValutar?.moneda;
			let priceConverted = original.pretVanzare;
			if (cur ?? "RON" != "RON") {
				priceConverted /= original.plata?.rataDeSchimbValutar?.valuare ?? 1;
			}
			return (
				<ColumnCell
					data={
						<>
							<PushFilter
								filters={[
									{
										column: "codPlata",
										label: "Cod Plata",
										page: "bilete",
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
										page: "bilete",
										label: "Moneda",
										value: cur ?? "",
									},
								]}
							>
								{priceConverted.toFixed(2) + " (plătit in " + cur + ")"}
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
										page: "bilete",
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
										page: "bilete",
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
										page: "bilete",
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
										page: "bilete",
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
		accessorKey: "detaliiLoc",
		header: ({ column }) => {
			return (
				<ColumnHeader column={column} title="Sala, Nr. Loc, Rand, Tip Loc" />
			);
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						<>
							<PushFilter
								filters={[
									{
										column: "numarSala",
										label: "Numar Sala",
										page: "bilete",
										value: original.salaSpectacol?.numarSala + "" ?? "",
									},
								]}
							>
								{original.salaSpectacol?.numarSala}
							</PushFilter>
							,
							<PushFilter
								filters={[
									{
										column: "numarLoc",
										page: "bilete",
										label: "Numar Loc",
										value: original.locSalaSpectacol?.numarLoc ?? "",
									},
								]}
							>
								{original.locSalaSpectacol?.numarLoc}
							</PushFilter>
							,
							<PushFilter
								filters={[
									{
										column: "rand",
										label: "Rand Sala",
										page: "bilete",
										value: original.locSalaSpectacol?.rand + "" ?? "",
									},
								]}
							>
								{original.locSalaSpectacol?.rand}
							</PushFilter>
							,
							<PushFilter
								filters={[
									{
										column: "tipLoc",
										page: "bilete",
										label: "Tip Loc",
										value: original.locSalaSpectacol?.tipLoc ?? "",
									},
								]}
							>
								{original.locSalaSpectacol?.tipLoc}
							</PushFilter>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cumparat Pe" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			return (
				<ColumnCell
					filters={[
						{
							page: "bilete",
							label: "Cumparat Pe",
							column: "creatPe",
							value: formatDate(show.creatPe),
						},
					]}
					data={capitalizeFirstLetter(formatDateFull(show.creatPe))}
				/>
			);
		},
	},
];
