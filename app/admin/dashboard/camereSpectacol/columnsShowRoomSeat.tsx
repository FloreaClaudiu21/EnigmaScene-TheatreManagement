"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { LocSalaSpectacol, TipuriTabel } from "@/lib/types";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";

export const columnsShowRoomSeat: ColumnDef<LocSalaSpectacol>[] = [
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
		cell: ({ row }) => {
			return (
				<ColumnCellActions
					type={TipuriTabel.SCAUN_CAMERA_SPECTACOL}
					deleteId={row.original.codLocSala}
					link_edit={
						"camereSpectacol/" + row.original.codLocSala + "/editare-loc"
					}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codLocSala",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Loc Sala" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codLocSala} />;
		},
	},
	{
		accessorKey: "numarLoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Loc" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.numarLoc} />;
		},
	},
	{
		accessorKey: "rand",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Rand Loc" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.rand} />;
		},
	},
	{
		accessorKey: "pretLoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Pret Loc (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.pretLoc} />;
		},
	},
	{
		accessorKey: "tipLoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Tip Loc" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.tipLoc} />;
		},
	},
	{
		accessorKey: "codSalaSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod & Nume Sala Spectacol" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.codSalaSpectacol +
						" - " +
						original.salaSpectacol?.numarSala
					}
				/>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Adăugat Pe" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={formatDateFull(row.original.creatPe)} />;
		},
	},
];
