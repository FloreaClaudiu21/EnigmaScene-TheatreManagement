"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { CategorieMaterialDecor, TipuriTabel } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter } from "@/lib/utils";

export const columnsMaterialsCategory: ColumnDef<CategorieMaterialDecor>[] = [
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
					deleteId={row.original.codCategorieMaterialDecor}
					type={TipuriTabel.MATERIAL_DECOR_CATEGORIE}
					link_edit={
						"materialeDecor/" +
						row.original.codCategorieMaterialDecor +
						"/editare-categorie"
					}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codCategorieMaterialDecor",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Categorie" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codCategorieMaterialDecor} />;
		},
	},
	{
		accessorKey: "numeCategorie",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Categorie" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.numeCategorie} />;
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
					data={capitalizeFirstLetter(formatDateFull(show.creatPe))}
				/>
			);
		},
	},
];
