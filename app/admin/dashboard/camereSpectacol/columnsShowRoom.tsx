"use client";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";
import {
	ColoanaSelecteazaCapTabel,
	ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import { SalaSpectacol, TipuriTabel } from "@/lib/tipuri";
import { ColumnDef } from "@tanstack/react-table";

export const columnsShowRoom: ColumnDef<SalaSpectacol>[] = [
	{
		id: "select",
		header: ({ table }) => {
			return <ColoanaSelecteazaCapTabel table={table} />;
		},
		cell: ({ row }) => {
			return <ColoanaSelecteazaRand row={row} />;
		},
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				<CelulaColoanaActiuni
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
			return <AntetColoana coloana={column} titlu="Cod Sala Spectacol" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "camereSpectacol",
							eticheta: "Cod Sala Spectacol",
							coloana: "codSalaSpectacol",
							valoare: user.codSalaSpectacol + "" ?? "",
						},
					]}
					date={user.codSalaSpectacol}
				/>
			);
		},
	},
	{
		accessorKey: "numarSala",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Numar Sala" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "camereSpectacol",
							eticheta: "Numar Sala",
							coloana: "numarSala",
							valoare: original.numarSala ?? "",
						},
					]}
					date={original.numarSala}
				/>
			);
		},
	},
	{
		accessorKey: "locuriSala",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Locuri In Sala" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "camereSpectacol",
							eticheta: "Locuri Sala",
							coloana: "numarSala",
							valoare: original.numarSala ?? "",
						},
						{
							pagina: "camereSpectacol",
							eticheta: "Cod Sala",
							coloana: "codSalaSpectacol",
							valoare: original.codSalaSpectacol + "",
						},
						{
							pagina: "camereSpectacol",
							eticheta: "TAB",
							coloana: "tab",
							valoare: "showsRoomSeats",
						},
					]}
					date={original.locuriSala?.length}
				/>
			);
		},
	},
	{
		accessorKey: "observatii",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Observatii" />;
		},
		cell: ({ row: { original } }) => {
			return <CelulaColoana date={original.observatii ?? "N/A"} />;
		},
	},
];
