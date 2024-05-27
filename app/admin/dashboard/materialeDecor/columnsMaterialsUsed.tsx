"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { MaterialDecorSpectacolFolosit, TipuriTabel } from "@/lib/types";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter } from "@/lib/utils";

export const columnsMaterialsUsed: ColumnDef<
	MaterialDecorSpectacolFolosit
>[] = [
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
					deleteId={row.original.codMaterialDecorSpectacolFolosit}
					type={TipuriTabel.MATERIAL_DECOR_FOLOSIT}
					link_edit={
						"materialeDecor/" +
						row.original.codMaterialDecorSpectacolFolosit +
						"/editare-folosit"
					}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codMaterialDecorSpectacolFolosit",
		header: ({ column }) => {
			return (
				<ColumnHeader column={column} title="Cod Material Decor Folosit" />
			);
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codMaterialDecorSpectacolFolosit} />;
		},
	},
	{
		accessorKey: "codSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Spectacol" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.codSpectacol} />;
		},
	},
	{
		accessorKey: "numeSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Spectacol" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.spectacol?.titlu} />;
		},
	},
	{
		accessorKey: "codMaterialDecorSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Material Decor" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codMaterialDecorSpectacol} />;
		},
	},
	{
		accessorKey: "numeMaterialDecor",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Material Decor" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell data={original.materialDecorSpectacol?.numeMaterial} />
			);
		},
	},
	{
		accessorKey: "cantitateaFolosita",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cantitatea Folosită" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.cantitateaFolosita +
						" " +
						original.materialDecorSpectacol?.unitateMastura
					}
				/>
			);
		},
	},
	{
		accessorKey: "cantitateaRamasaPeStoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cantitatea Rămasă" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.cantitateaRamasaPeStoc +
						" " +
						original.materialDecorSpectacol?.unitateMastura
					}
				/>
			);
		},
	},
	{
		accessorKey: "dataFolosirii",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Data Folosirii" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={capitalizeFirstLetter(
						formatDateFull(new Date(original.dataFolosirii))
					)}
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
			return (
				<ColumnCell
					data={capitalizeFirstLetter(formatDateFull(show.creatPe))}
				/>
			);
		},
	},
];
