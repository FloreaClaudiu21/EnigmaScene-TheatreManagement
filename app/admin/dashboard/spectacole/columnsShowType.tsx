"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { TipSpectacol, TipuriTabel } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

export const columnsShowType: ColumnDef<TipSpectacol>[] = [
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
					type={TipuriTabel.SPECTACOL_CATEGORIE}
					deleteId={row.original.codTipSpectacol}
					link_edit={
						"spectacole/" + row.original.codTipSpectacol + "/editare-categorie"
					}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codTipSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Categorie Spectacol" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<ColumnCell
					filters={[
						{
							page: "spectacole",
							column: "codTipSpectacol",
							label: "Cod Categorie Spectacol",
							value: user.codTipSpectacol + "",
						},
					]}
					data={user.codTipSpectacol}
				/>
			);
		},
	},
	{
		accessorKey: "numeTip",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Categorie" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "spectacole",
							column: "numeTip",
							label: "Nume Categorie Spectacol",
							value: original.numeTip + "",
						},
					]}
					data={original.numeTip}
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
