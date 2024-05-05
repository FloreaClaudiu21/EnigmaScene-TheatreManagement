"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { Image, Tooltip } from "@nextui-org/react";
import { Spectacol, TipuriTabel } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";

export const columnsShow: ColumnDef<Spectacol>[] = [
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
					type={TipuriTabel.SPECTACOL}
					deleteId={row.original.codSpectacol}
					link_edit={"spectacole/" + row.original.codSpectacol + "/editare"}
				/>
			);
		},
		enableSorting: false,
	},
	{
		id: "photo",
		cell: ({ row: { original } }) => {
			return (
				<div className="w-full min-h-28 !pr-0">
					<Tooltip
						showArrow
						content={original.descriereScurta}
						className="max-w-40"
					>
						<Image
							height={96}
							alt="No Photo"
							src={original.imagine}
							className="w-full h-28 object-contain rounded-sm"
						/>
					</Tooltip>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Spectacol" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codSpectacol} />;
		},
	},
	{
		accessorKey: "titlu",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Titlu" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.titlu} />;
		},
	},
	// {
	// 	accessorKey: "continut",
	// 	header: ({ column }) => {
	// 		return <ColumnHeader column={column} title="Conținut" />;
	// 	},
	// 	cell: ({ row: { original } }) => {
	// 		return <ColumnCell data={original.continut} />;
	// 	},
	// },
	// {
	// 	accessorKey: "actorii",
	// 	header: ({ column }) => {
	// 		return <ColumnHeader column={column} title="Actorii" />;
	// 	},
	// 	cell: ({ row: { original } }) => {
	// 		return <ColumnCell data={original.actorii} />;
	// 	},
	// },
	{
		accessorKey: "director",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Regizor" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.director} />;
		},
	},
	{
		accessorKey: "oraIncepere",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ora & Data Inceperii" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.oraIncepere.replace("T", " ").split(".")[0];
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "oraTerminare",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ora & Data Terminării" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.oraTerminare.replace("T", " ").split(".")[0];
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "codSezon",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Sezon & Categorie" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.sezon?.numeSezon + " - " + original.tipSpectacol?.numeTip
					}
				/>
			);
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
		accessorKey: "bileteVandute",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Bilete Vandute" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						(original.bileteVandute?.length ?? 0) +
						"/" +
						original.salaSpectacol?.locuriSala?.length
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
			const theDate = formatDateFull(show.creatPe);
			return <ColumnCell data={theDate} />;
		},
	},
];
