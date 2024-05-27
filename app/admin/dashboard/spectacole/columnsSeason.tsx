"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { Sezon, TipuriTabel } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

export const columnsSeason: ColumnDef<Sezon>[] = [
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
					type={TipuriTabel.SPECTACOL_SEZON}
					deleteId={row.original.codSezon}
					link_edit={"spectacole/" + row.original.codSezon + "/editare-sezon"}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codSezon",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Sezon" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<ColumnCell
					filters={[
						{
							page: "spectacole",
							label: "Cod Sezon",
							column: "codSezon",
							value: user.codSezon + "" ?? "",
						},
					]}
					data={user.codSezon}
				/>
			);
		},
	},
	{
		accessorKey: "numeSezon",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Sezon" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "spectacole",
							label: "Nume Sezon",
							column: "numeSezon",
							value: original.numeSezon + "" ?? "",
						},
					]}
					data={original.numeSezon}
				/>
			);
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Creat Pe" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			return (
				<ColumnCell
					filters={[
						{
							page: "spectacole",
							label: "Adaugat Pe",
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
