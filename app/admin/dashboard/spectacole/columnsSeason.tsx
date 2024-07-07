"use client";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";
import {
	ColoanaSelecteazaCapTabel,
	ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { Sezon, TipuriTabel } from "@/lib/tipuri";
import { ColumnDef } from "@tanstack/react-table";

export const columnsSeason: ColumnDef<Sezon>[] = [
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
					type={TipuriTabel.SEZON_SPECTACOL}
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
			return <AntetColoana coloana={column} titlu="Cod Sezon" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "spectacole",
							eticheta: "Cod Sezon",
							coloana: "codSezon",
							valoare: user.codSezon + "" ?? "",
						},
					]}
					date={user.codSezon}
				/>
			);
		},
	},
	{
		accessorKey: "numeSezon",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Nume Sezon" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "spectacole",
							eticheta: "Nume Sezon",
							coloana: "numeSezon",
							valoare: original.numeSezon + "" ?? "",
						},
					]}
					date={original.numeSezon}
				/>
			);
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Creat Pe" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "spectacole",
							eticheta: "Adaugat Pe",
							coloana: "creatPe",
							valoare: formateazaData(show.creatPe),
						},
					]}
					date={capitalizeazaPrimaLitera(formateazaDataComplet(show.creatPe))}
				/>
			);
		},
	},
];
