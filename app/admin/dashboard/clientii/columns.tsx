"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { Button, Chip, Link } from "@nextui-org/react";
import {
	formularStergereAdresa,
	formularStergereInregistrari,
} from "@/services/general/FurnizorStare";
import { User } from "next-auth";
import { TipuriTabel } from "@/lib/tipuri";
import {
	ColoanaSelecteazaCapTabel,
	ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";
import { formateazaData, formateazaDataComplet } from "@/lib/intervaleOptiuni";

function ActionButtons({ user }: { user: User }) {
	const deleteModal = formularStergereInregistrari();
	return (
		<div className="flex flex-row items-center justify-center text-center gap-2">
			<Button
				size="sm"
				as={Link}
				radius="sm"
				variant="faded"
				className="text-zinc-600 border-zinc-400 font-medium"
				href={"clientii/" + user.codClient + "/editare"}
			>
				Editare
			</Button>
			<Button
				size="sm"
				isIconOnly
				radius="sm"
				variant="light"
				className="text-zinc-600 hover:text-red-600"
				onPress={() => {
					deleteModal.setTip(TipuriTabel.CLIENT);
					deleteModal.setCodStergere(user.codClient);
					deleteModal.setVizibil(true);
				}}
			>
				<Trash2Icon size={18} />
			</Button>
		</div>
	);
}

export const columns: ColumnDef<User>[] = [
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
			const user = row.original;
			return <ActionButtons user={user} />;
		},
		enableSorting: false,
	},
	{
		accessorKey: "codClient",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod Client" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "clientii",
							eticheta: "Cod Client",
							coloana: "codClient",
							valoare: user.codClient + "" ?? "",
						},
					]}
					date={user.codClient}
				/>
			);
		},
	},
	{
		accessorKey: "numeClient",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Nume Client" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "clientii",
							eticheta: "Nume Client",
							coloana: "numeClient",
							valoare: user.numeClient + "" ?? "",
						},
					]}
					date={user.numeClient}
				/>
			);
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Email" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					date={user.email}
					filtre={[
						{
							pagina: "clientii",
							eticheta: "Email",
							coloana: "email",
							valoare: user.email + "" ?? "",
						},
					]}
					clasa={`${user.utlizatorAdmin && "font-bold underline"}`}
				/>
			);
		},
	},
	{
		accessorKey: "telefon",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Telefon" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "clientii",
							eticheta: "Telefon",
							coloana: "telefon",
							valoare: user.telefon + "" ?? "",
						},
					]}
					date={user.telefon}
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
			const user = row.original;
			const theDate = capitalizeazaPrimaLitera(
				formateazaDataComplet(user.creatPe)
			);
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "clientii",
							eticheta: "Adăugat Pee",
							coloana: "creatPe",
							valoare: formateazaData(row.original.creatPe),
						},
					]}
					date={theDate}
				/>
			);
		},
	},
	{
		accessorKey: "bileteCumparate",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Bilete Cumpărate" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bilete",
							eticheta: "Bilete Client",
							coloana: "codClient",
							valoare: user.codClient + "" ?? "",
						},
						{
							pagina: "bilete",
							eticheta: "Bilete Client",
							coloana: "numeClient",
							valoare: user.numeClient + "" ?? "",
						},
					]}
					date={user.bileteCumparate?.length ?? 0}
				/>
			);
		},
	},
	{
		accessorKey: "platiiEfectuate",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Plății" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "platii",
							eticheta: "Plății Client",
							coloana: "codClient",
							valoare: user.codClient + "" ?? "",
						},
						{
							pagina: "platii",
							eticheta: "Bilete Client",
							coloana: "numeClient",
							valoare: user.numeClient + "" ?? "",
						},
					]}
					date={user.platiiEfectuate?.length ?? 0}
				/>
			);
		},
	},
];
