"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell, { PushFilter } from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { LocSalaSpectacol, TipuriTabel } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

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
			return (
				<ColumnCell
					filters={[
						{
							page: "camereSpectacol",
							label: "Cod Loc Sala",
							column: "codLocSala",
							value: user.codLocSala + "" ?? "",
						},
					]}
					data={user.codLocSala}
				/>
			);
		},
	},
	{
		accessorKey: "numarLoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Numar Loc" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "camereSpectacol",
							label: "Numar Loc",
							column: "numarLoc",
							value: original.numarLoc ?? "",
						},
					]}
					data={original.numarLoc}
				/>
			);
		},
	},
	{
		accessorKey: "rand",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Rand Loc" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "camereSpectacol",
							label: "Rand Loc",
							column: "rand",
							value: original.rand ?? "",
						},
					]}
					data={original.rand}
				/>
			);
		},
	},
	{
		accessorKey: "pretLoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Pret Loc (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "camereSpectacol",
							label: "Pret",
							column: "pretLoc",
							value: original.pretLoc + "" ?? "",
						},
					]}
					data={original.pretLoc}
				/>
			);
		},
	},
	{
		accessorKey: "tipLoc",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Tip Loc" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "camereSpectacol",
							label: "Tip Loc Sala",
							column: "tipLoc",
							value: original.tipLoc ?? "",
						},
					]}
					data={original.tipLoc}
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
						<>
							<PushFilter
								filters={[
									{
										column: "codSalaSpectacol",
										label: "Cod Sala Spectacol",
										page: "camereSpectacol",
										value: original.codSalaSpectacol + "" ?? "",
									},
								]}
							>
								{original.codSalaSpectacol}
							</PushFilter>
							-
							<PushFilter
								filters={[
									{
										column: "numarSala",
										page: "camereSpectacol",
										label: "Numar Sala",
										value: original.salaSpectacol?.numarSala + "" ?? "",
									},
								]}
							>
								{original.salaSpectacol?.numarSala}
							</PushFilter>
						</>
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
			return (
				<ColumnCell
					filters={[
						{
							page: "camereSpectacol",
							label: "Adăugat Pee",
							column: "creatPe",
							value: formatDate(row.original.creatPe),
						},
					]}
					data={capitalizeFirstLetter(formatDateFull(row.original.creatPe))}
				/>
			);
		},
	},
];
