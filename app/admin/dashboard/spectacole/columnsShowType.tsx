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
import { TipSpectacol, TipuriTabel } from "@/lib/tipuri";
import { ColumnDef } from "@tanstack/react-table";

export const columnsShowType: ColumnDef<TipSpectacol>[] = [
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
					type={TipuriTabel.CATEGORIE_SPECTACOL}
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
			return <AntetColoana coloana={column} titlu="Cod Categorie Spectacol" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "spectacole",
							coloana: "codTipSpectacol",
							eticheta: "Cod Categorie Spectacol",
							valoare: user.codTipSpectacol + "",
						},
					]}
					date={user.codTipSpectacol}
				/>
			);
		},
	},
	{
		accessorKey: "numeTip",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Nume Categorie" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "spectacole",
							coloana: "numeTip",
							eticheta: "Nume Categorie Spectacol",
							valoare: original.numeTip + "",
						},
					]}
					date={original.numeTip}
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
