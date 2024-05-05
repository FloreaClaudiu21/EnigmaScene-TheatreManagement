"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { SalaSpectacol, TipuriTabel } from "@/lib/types";

export const columnsShowRoom: ColumnDef<SalaSpectacol>[] = [
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
					type={TipuriTabel.CAMERA_SPECTACOL}
					deleteId={row.original.codSalaSpectacol}
					link_edit={
						"camereSpectacol/" + row.original.codSalaSpectacol + "/editare"
					}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codSalaSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Sala Spectacol" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codSalaSpectacol} />;
		},
	},
	{
		accessorKey: "numarSala",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Sala" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.numarSala} />;
		},
	},
	{
		accessorKey: "locuriSala",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Locuri In Sala" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.locuriSala?.length} />;
		},
	},
	{
		accessorKey: "observatii",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Observatii" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.observatii ?? "N/A"} />;
		},
	},
];
