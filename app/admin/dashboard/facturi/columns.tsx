"use client";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana, {
	AplicaFiltru,
} from "@/components/admin/table/CelulaColoana";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";
import {
	ColoanaSelecteazaCapTabel,
	ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import ModalViewFiscalReceipt from "@/components/bonuriFiscale/ButonVizualizareBon";
import ModalViewInvoice from "@/components/facturaFiscala/ButonVizualizareFacturaFiscala";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { FacturaFiscala, TipuriTabel } from "@/lib/tipuri";
import { ColumnDef } from "@tanstack/react-table";

export const columnsInvoice: ColumnDef<FacturaFiscala>[] = [
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
				<div className="flex flex-row gap-2">
					<div className="flex flex-row gap-2 place-items-center">
						<ModalViewInvoice invoice={original} />
						<ModalViewFiscalReceipt receipt={original.bonFiscal} />
					</div>
					<CelulaColoanaActiuni
						deleteId={original.codFactura}
						type={TipuriTabel.FACTURA_FISCALA}
						link_edit={"facturi/" + original.codFactura + "/editare"}
					/>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "numarFactura",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Numar Factura" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "facturi",
							eticheta: "Numar Factura",
							coloana: "numarFactura",
							valoare: original.numarFactura ?? "",
						},
					]}
					date={original.numarFactura}
				/>
			);
		},
	},
	{
		accessorKey: "dataIntocmiri",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Data Intocmirii" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "facturi",
							eticheta: "Data Intocmirii",
							coloana: "dataIntocmiri",
							valoare: formateazaData(original.dataIntocmiri) ?? "",
						},
					]}
					date={capitalizeazaPrimaLitera(
						formateazaDataComplet(original.dataIntocmiri)
					)}
				/>
			);
		},
	},
	{
		accessorKey: "codPlata",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod Plata" />;
		},
		cell: ({ row }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "facturi",
							eticheta: "Cod Plata",
							coloana: "codPlata",
							valoare: row.original.codPlata + "" ?? "",
						},
					]}
					date={row.original.codPlata}
				/>
			);
		},
	},
	{
		accessorKey: "sumaPlatita",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Suma Platita" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "facturi",
							eticheta: "Moneda",
							coloana: "moneda",
							valoare:
								(original.sumaPlatita + original.costuriExtra).toFixed(2) ?? "",
						},
					]}
					date={
						(original.sumaPlatita + original.costuriExtra).toFixed(2) + " RON"
					}
				/>
			);
		},
	},
	{
		accessorKey: "numarBonFiscal",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Cod & Nr. Bon Fiscal" />;
		},
		cell: ({ row }) => {
			return (
				<CelulaColoana
					date={
						<>
							<AplicaFiltru
								filtre={[
									{
										pagina: "facturi",
										coloana: "codBonFiscal",
										eticheta: "Cod Bon Fiscal",
										valoare: row.original.codBonFiscal + "" ?? "",
									},
								]}
							>
								{row.original.codBonFiscal}
							</AplicaFiltru>
							-
							<AplicaFiltru
								filtre={[
									{
										pagina: "facturi",
										coloana: "numarBonFiscal",
										eticheta: "Numar Bon Fiscal",
										valoare: row.original.bonFiscal?.numarBonFiscal ?? "",
									},
								]}
							>
								{row.original.bonFiscal?.numarBonFiscal}
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
			return <AntetColoana coloana={column} titlu="Cod Client" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							coloana: "codClient",
							eticheta: "Cod Client",
							pagina: "facturi",
							valoare: original.codClient + "" ?? "",
						},
					]}
					date={original.codClient}
				/>
			);
		},
	},
	{
		accessorKey: "bileteVandute",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Bilete Asociate" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					filtre={[
						{
							pagina: "bilete",
							eticheta: "Bilete Asociate",
							coloana: "codFactura",
							valoare: original.codFactura + "",
						},
					]}
					date={original.bileteSpectacol?.length ?? 0}
				/>
			);
		},
	},
	{
		accessorKey: "adresaFacturare",
		header: ({ column }) => {
			return <AntetColoana coloana={column} titlu="Detalii Facturare" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<CelulaColoana
					date={
						<div className="flex flex-row flex-wrap justify-center">
							<AplicaFiltru
								filtre={[
									{
										coloana: "numeClient",
										eticheta: "Nume Client",
										pagina: "facturi",
										valoare: original.numeClient ?? "",
									},
								]}
							>
								{original.numeClient}
							</AplicaFiltru>
							,
							<AplicaFiltru
								filtre={[
									{
										coloana: "email",
										pagina: "facturi",
										eticheta: "Email Client",
										valoare: original.email ?? "",
									},
								]}
							>
								{original.email}
							</AplicaFiltru>
							,
							<AplicaFiltru
								filtre={[
									{
										coloana: "telefon",
										eticheta: "Telefon",
										pagina: "facturi",
										valoare: original.telefon ?? "",
									},
								]}
							>
								{original.telefon}
							</AplicaFiltru>
							,
							<AplicaFiltru
								filtre={[
									{
										pagina: "facturi",
										coloana: "adresaFacturare",
										eticheta: "Adresa Facturare",
										valoare: original.adresaFacturare ?? "",
									},
								]}
							>
								{original.adresaFacturare}
							</AplicaFiltru>
						</div>
					}
				/>
			);
		},
	},
];
