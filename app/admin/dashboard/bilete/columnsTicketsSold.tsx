"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@nextui-org/react";
import { useOptimistic, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BiletSpectacol, TipuriTabel } from "@/lib/tipuri";
import { verificareBiletSpectacol } from "@/services/backend/bilete/verificareBiletSpectacol";
import {
	ColoanaSelecteazaCapTabel,
	ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import ModalViewInvoice from "@/components/facturaFiscala/ButonVizualizareFacturaFiscala";
import ModalViewFiscalReceipt from "@/components/bonuriFiscale/ButonVizualizareBon";
import ModalViewTicket from "@/components/bileteSpectacol/ButonVizualizareBilet";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana, {
	AplicaFiltru,
} from "@/components/admin/table/CelulaColoana";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";
import { formateazaData, formateazaDataComplet } from "@/lib/intervaleOptiuni";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";

const VerifyComponent = ({ bilet }: { bilet: BiletSpectacol }) => {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [checked, setChecked] = useOptimistic(bilet.biletVerificat);
	const verifyMethod = async () => {
		if (isPending) return;
		setChecked(!bilet.biletVerificat);
		const response = await verificareBiletSpectacol(bilet);
		if (!response.ok) {
			toast({
				title: "Verificare bilet la spectacol",
				variant: "destructive",
				description:
					"A apărut o eroare necunoscută în timpul verificari biletului. Vă rugăm să încercați din nou mai târziu.",
			});
		}
	};
	return (
		<div className="flex flex-row items-center justify-center text-center break-all">
			<Checkbox
				isSelected={checked}
				value={checked + ""}
				onValueChange={() => {
					startTransition(() => verifyMethod());
				}}
			/>
		</div>
	);
};

export const columnsTicketsSold: ColumnDef<BiletSpectacol>[] = [
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
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2 flex-wrap">
					<div className="flex flex-row gap-2 place-items-center">
						<ModalViewInvoice invoice={original.factura} />
						<ModalViewFiscalReceipt receipt={original.bonFiscal} />
						<ModalViewTicket ticket={original} />
					</div>
					<CelulaColoanaActiuni
						deleteId={original.codBiletSpectacol}
						type={TipuriTabel.BILET}
						link_edit={"bilete/" + original.codBiletSpectacol + "/editare"}
					/>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "verificareBilet",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Bilet Verificat" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <VerifyComponent bilet={user} />;
		},
	},
	{
		accessorKey: "codBiletSpectacol",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod Bilet Spectacol" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bilete",
							eticheta: "Cod Bilet Spectacol",
							coloana: "codBiletSpectacol",
							valoare: user.codBiletSpectacol + "" ?? "",
						},
					]}
					date={user.codBiletSpectacol}
				/>
			);
		},
	},
	{
		accessorKey: "numarBilet",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Numar Bilet" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bilete",
							eticheta: "Numar Bilet",
							coloana: "numarBilet",
							valoare: original.numarBilet + "" ?? "",
						},
					]}
					date={original.numarBilet}
				/>
			);
		},
	},
	{
		accessorKey: "pretVanzare",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod Plata & Preț Bilet" />;
		},
		cell: ({ row: { original } }) => {
			let priceConverted = original.pretVanzare;
			return (
				<CelulaColoana
					date={
						<>
							<AplicaFiltru
								filtre={[
									{
										coloana: "codPlata",
										eticheta: "Cod Plata",
										pagina: "bilete",
										valoare: original.codPlata + "" ?? "",
									},
								]}
							>
								{original.codPlata}
							</AplicaFiltru>
							-
							<AplicaFiltru
								filtre={[
									{
										coloana: "moneda",
										pagina: "bilete",
										eticheta: "Moneda",
										valoare: priceConverted.toFixed(2) ?? "",
									},
								]}
							>
								{priceConverted.toFixed(2) + " RON"}
							</AplicaFiltru>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "numeClient",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod & Nume Client" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					date={
						<>
							<AplicaFiltru
								filtre={[
									{
										coloana: "codClient",
										eticheta: "Cod Client",
										pagina: "bilete",
										valoare: original.codClient + "" ?? "",
									},
								]}
							>
								{original.codClient}
							</AplicaFiltru>
							-
							<AplicaFiltru
								filtre={[
									{
										coloana: "numeClient",
										pagina: "bilete",
										eticheta: "Nume Client",
										valoare: original.client?.numeClient ?? "",
									},
								]}
							>
								{original.client?.numeClient}
							</AplicaFiltru>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "numeSpectacol",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod & Nume Spectacol" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					date={
						<>
							<AplicaFiltru
								filtre={[
									{
										coloana: "codSpectacol",
										eticheta: "Cod Spectacol",
										pagina: "bilete",
										valoare: original.codSpectacol + "" ?? "",
									},
								]}
							>
								{original.codSpectacol}
							</AplicaFiltru>
							-
							<AplicaFiltru
								filtre={[
									{
										coloana: "titlu",
										pagina: "bilete",
										eticheta: "Titlu Spectacol",
										valoare: original.spectacol?.titlu ?? "",
									},
								]}
							>
								{original.spectacol?.titlu}
							</AplicaFiltru>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "detaliiLoc",
		header: ({ column }) => {
			return (
				<AntetColoana coloana={column} titlu="Sala, Nr. Loc, Rand, Tip Loc" />
			);
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					date={
						<>
							<AplicaFiltru
								filtre={[
									{
										coloana: "numarSala",
										eticheta: "Numar Sala",
										pagina: "bilete",
										valoare: original.salaSpectacol?.numarSala + "" ?? "",
									},
								]}
							>
								{original.salaSpectacol?.numarSala}
							</AplicaFiltru>
							,
							<AplicaFiltru
								filtre={[
									{
										coloana: "numarLoc",
										pagina: "bilete",
										eticheta: "Numar Loc",
										valoare: original.locSalaSpectacol?.numarLoc ?? "",
									},
								]}
							>
								{original.locSalaSpectacol?.numarLoc}
							</AplicaFiltru>
							,
							<AplicaFiltru
								filtre={[
									{
										coloana: "rand",
										eticheta: "Rand Sala",
										pagina: "bilete",
										valoare: original.locSalaSpectacol?.rand + "" ?? "",
									},
								]}
							>
								{original.locSalaSpectacol?.rand}
							</AplicaFiltru>
							,
							<AplicaFiltru
								filtre={[
									{
										coloana: "tipLoc",
										pagina: "bilete",
										eticheta: "Tip Loc",
										valoare: original.locSalaSpectacol?.tipLoc ?? "",
									},
								]}
							>
								{original.locSalaSpectacol?.tipLoc}
							</AplicaFiltru>
						</>
					}
				/>
			);
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cumparat Pe" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bilete",
							eticheta: "Cumparat Pe",
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
