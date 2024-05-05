"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { MaterialDecorSpectacol, TipuriTabel } from "@/lib/types";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";

export const columnsMaterials: ColumnDef<MaterialDecorSpectacol>[] = [
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
					type={TipuriTabel.MATERIAL_DECOR}
					deleteId={row.original.codMaterialDecor}
					link_edit={
						"materialeDecor/" + row.original.codMaterialDecor + "/editare"
					}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codMaterialDecor",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Material Decor" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codMaterialDecor} />;
		},
	},
	{
		accessorKey: "numeMaterial",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Material" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.numeMaterial} />;
		},
	},
	{
		accessorKey: "codCategorieMaterialDecor",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod & Nume Categorie" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.codCategorieMaterialDecor +
						" - " +
						original.categorieMaterialDecor?.numeCategorie
					}
				/>
			);
		},
	},
	{
		accessorKey: "cantitateStoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Stoc Curent" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={original.cantitateStoc + " " + original.unitateMastura}
				/>
			);
		},
	},
	{
		accessorKey: "producator",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Producător" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.producator} />;
		},
	},
	{
		accessorKey: "dataAchizitie",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Data Achiziție și prețul" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.dataAchizitie + " - " + original.pretAchizitie + " RON"
					}
				/>
			);
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Adăugat Pe" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			return <ColumnCell data={formatDateFull(show.creatPe)} />;
		},
	},
];
