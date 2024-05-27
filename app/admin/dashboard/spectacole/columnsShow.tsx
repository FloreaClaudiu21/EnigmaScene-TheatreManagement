"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell, { PushFilter } from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { Button, Tooltip } from "@nextui-org/react";
import { Spectacol, TipuriTabel } from "@/lib/types";
import { formatDateFull } from "@/lib/rangeOptions";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { useImageShowModal } from "@/services/StateProvider";

function ActionsShow({ row }: { row: any }) {
	const imgModal = useImageShowModal();
	return (
		<div className="flex flex-row gap-2">
			<ColumnCellActions
				type={TipuriTabel.SPECTACOL}
				deleteId={row.original.codSpectacol}
				link_edit={"spectacole/" + row.original.codSpectacol + "/editare"}
			/>
			<Button
				size="sm"
				radius="sm"
				isIconOnly
				variant="bordered"
				onClick={() => {
					imgModal.setShow(row.original);
					imgModal.setVisible(true);
				}}
				title="Vizualizare imagine spectacol"
				className="text-zinc-600 font-medium hover:text-red-600"
			>
				<ImageIcon size={18} />
			</Button>
		</div>
	);
}

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
			return <ActionsShow row={row} />;
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
			return (
				<ColumnCell
					filters={[
						{
							page: "spectacole",
							label: "Cod Spectacol",
							column: "codSpectacol",
							value: user.codSpectacol + "" ?? "",
						},
					]}
					data={user.codSpectacol}
				/>
			);
		},
	},
	{
		accessorKey: "titlu",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Titlu" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							label: "Titlu",
							column: "titlu",
							page: "spectacole",
							value: original.titlu ?? "",
						},
					]}
					data={
						<div className="flex flex-row items-start justify-center text-center h-full break-words">
							<Tooltip
								content={original.descriereScurta}
								className="max-w-32"
								showArrow
							>
								<p>{original.titlu}</p>
							</Tooltip>
						</div>
					}
				/>
			);
		},
	},
	{
		accessorKey: "director",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Regizor" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							label: "Regizor",
							column: "director",
							page: "spectacole",
							value: original.director ?? "",
						},
					]}
					data={original.director}
				/>
			);
		},
	},
	{
		accessorKey: "oraIncepere",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ora & Data Inceperii" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			return (
				<ColumnCell
					filters={[
						{
							column: "oraIncepere",
							page: "spectacole",
							label: "Ora Incepere Spectacol",
							value: formatDate(new Date(show.oraIncepere)) ?? "",
						},
					]}
					data={capitalizeFirstLetter(
						formatDateFull(new Date(show.oraIncepere))
					)}
				/>
			);
		},
	},
	{
		accessorKey: "oraTerminare",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ora & Data Terminării" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			return (
				<ColumnCell
					filters={[
						{
							column: "oraTerminare",
							page: "spectacole",
							label: "Ora Terminare Spectacol",
							value: formatDate(new Date(show.oraTerminare)) ?? "",
						},
					]}
					data={capitalizeFirstLetter(
						formatDateFull(new Date(show.oraTerminare))
					)}
				/>
			);
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
						<>
							<PushFilter
								filters={[
									{
										column: "numeSezon",
										label: "Numele sezonului",
										page: "spectacole",
										value: original.sezon?.numeSezon ?? "",
									},
								]}
							>
								{original.sezon?.numeSezon}
							</PushFilter>
							-
							<PushFilter
								filters={[
									{
										column: "numeTip",
										page: "spectacole",
										label: "Tipul Spectacolului",
										value: original.tipSpectacol?.numeTip ?? "",
									},
								]}
							>
								{original.tipSpectacol?.numeTip}
							</PushFilter>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "codSalaSpectacol",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod & Nume Sala" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						<>
							<PushFilter
								filters={[
									{
										page: "spectacole",
										column: "codSalaSpectacol",
										label: "Cod Sala Spectacol",
										value: original.codSalaSpectacol + "",
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
										page: "spectacole",
										label: "Numar Sala",
										value: original.salaSpectacol?.numarSala ?? "",
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
		accessorKey: "bileteVandute",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Bilete Vandute" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					filters={[
						{
							page: "bilete",
							label: "Bilete Vandute",
							column: "codSpectacol",
							value: original.codSpectacol + "",
						},
						{
							page: "bilete",
							label: "Bilete Vandute",
							column: "titlu",
							value: original.titlu + "",
						},
					]}
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
			const theDate = capitalizeFirstLetter(formatDateFull(show.creatPe));
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
					data={theDate}
				/>
			);
		},
	},
];
