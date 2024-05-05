"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
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
import { useOptimistic } from "react";

const VerifyComponent = ({ bilet }: { bilet: BiletSpectacol }) => {
	const [checked, setChecked] = useOptimistic(
		bilet.biletVerificat,
		(state, value) => !state
	);
	const verifiyMethod = async () => {
		setChecked(true);
		const response = await verifyTicket(bilet);
	};
	return (
		<div className="flex flex-row items-center justify-center text-center break-all">
			<Checkbox
				isSelected={checked}
				value={checked + ""}
				onValueChange={() => {
					verifiyMethod();
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
			return <ColumnCell data={user.codBiletSpectacol} />;
		},
	},
	{
		accessorKey: "numarBilet",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Bilet" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.numarBilet} />;
		},
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Plata" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codPlata} />;
		},
	},
	{
		accessorKey: "pretVanzare",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Pret Vanzare (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.pretVanzare} />;
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
					data={original.codClient + " - " + original.client?.numeClient}
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
					data={original.codSpectacol + " - " + original.spectacol?.titlu}
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
						original.salaSpectacol?.numarSala +
						", " +
						original.locSalaSpectacol?.numarLoc +
						", " +
						original.locSalaSpectacol?.rand +
						", " +
						original.locSalaSpectacol?.tipLoc
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
			return <ColumnCell data={formatDateFull(show.creatPe)} />;
		},
	},
];
