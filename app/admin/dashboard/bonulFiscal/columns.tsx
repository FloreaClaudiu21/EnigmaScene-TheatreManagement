"use client";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana, {
	AplicaFiltru,
} from "@/components/admin/table/CelulaColoana";
import ModalViewFiscalReceipt from "@/components/bonuriFiscale/ButonVizualizareBon";
import ModalViewInvoice from "@/components/facturaFiscala/ButonVizualizareFacturaFiscala";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { BonFiscal } from "@/lib/tipuri";
import { ColumnDef } from "@tanstack/react-table";

export const columnsReceipts: ColumnDef<BonFiscal>[] = [
	{
		id: "actions",
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2 place-items-center flex-wrap">
					<ModalViewInvoice invoice={original.factura} />
					<ModalViewFiscalReceipt receipt={original} />
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "codBonFiscal",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod Bon Fiscal" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bonulFiscal",
							eticheta: "Cod Bon Fiscal",
							coloana: "codBonFiscal",
							valoare: user.codBonFiscal + "" ?? "",
						},
					]}
					date={user.codBonFiscal}
				/>
			);
		},
	},
	{
		accessorKey: "numarBonFiscal",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Numar Bon" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bonulFiscal",
							eticheta: "Numar Bon Fiscal",
							coloana: "numarBonFiscal",
							valoare: original.numarBonFiscal + "" ?? "",
						},
					]}
					date={original.numarBonFiscal}
				/>
			);
		},
	},
	{
		accessorKey: "serieBonFiscal",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Serie Bon" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bonulFiscal",
							eticheta: "Serie Bon Fiscal",
							coloana: "serieBonFiscal",
							valoare: original.serieBonFiscal + "" ?? "",
						},
					]}
					date={original.serieBonFiscal}
				/>
			);
		},
	},
	{
		accessorKey: "sumaPlatita",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod Plata & Suma Platită" />;
		},
		cell: ({ row: { original } }) => {
			let priceConverted = original.plata?.sumaPlatita ?? 0;
			return (
				<CelulaColoana
					date={
						<>
							<AplicaFiltru
								filtre={[
									{
										coloana: "codPlata",
										eticheta: "Cod Plata",
										pagina: "bonulFiscal",
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
										pagina: "bonulFiscal",
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
										pagina: "bonulFiscal",
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
										pagina: "bonulFiscal",
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
		accessorKey: "titlu",
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
										pagina: "bonulFiscal",
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
										pagina: "bonulFiscal",
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
		accessorKey: "bileteVandute",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Bilete Vandute" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bilete",
							eticheta: "Bilete Vandute",
							coloana: "codSpectacol",
							valoare: original.codSpectacol + "",
						},
						{
							pagina: "bilete",
							eticheta: "Bilete Vandute",
							coloana: "titlu",
							valoare: original.spectacol?.titlu ?? "",
						},
					]}
					date={
						(original.bileteSpectacol?.length ?? 0) +
						"/" +
						original.spectacol?.salaSpectacol?.locuriSala?.length
					}
				/>
			);
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Bon Emis Pe" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bilete",
							eticheta: "Emis Pe",
							coloana: "creatPe",
							valoare: formateazaData(original.creatPe),
						},
					]}
					date={capitalizeazaPrimaLitera(
						formateazaDataComplet(original.creatPe)
					)}
				/>
			);
		},
	},
];
