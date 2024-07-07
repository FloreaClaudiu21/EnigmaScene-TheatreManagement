import { prisma } from "@/lib/prismaClient";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { StickyNoteIcon } from "lucide-react";
import { BonFiscal } from "@/lib/tipuri";
import {
	formateazaDataComplet,
	formateazaNumar,
	obtineOptiuneInterval,
} from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";

export default async function BonuriFiscaleStatCard({
	searchParams,
}: {
	searchParams: any;
}) {
	let emiseBonuri: BonFiscal[] = [];
	const queryKey = "fiscalReceipt";
	const selectedRangeLabel = obtineOptiuneInterval(searchParams, queryKey);
	const bonuri: BonFiscal[] = await prisma.bonFiscal.findMany({
		include: {
			plata: true,
			client: true,
			spectacol: true,
			factura: true,
		},
	});
	if (selectedRangeLabel.eticheta != "Toate zilele") {
		emiseBonuri = bonuri.filter((b) => {
			const dateNow = new Date();
			const dataCrearii = new Date(b.creatPe);
			return (
				dataCrearii >= (selectedRangeLabel.dataInceput ?? dateNow) &&
				dataCrearii < (selectedRangeLabel.dataSfarsit ?? dateNow)
			);
		});
	}
	const avM = emiseBonuri.length;
	return (
		<GeneralStatCard
			queryKey={queryKey}
			searchParams={searchParams}
			title="Bonuri Fiscale Emise"
			selectedRangeLabel={selectedRangeLabel}
			icon={<StickyNoteIcon className="h-6 w-6 text-muted-foreground" />}
			subtitle={`Total bonuri fiscale: ${formateazaNumar(bonuri.length)}`}
			body={
				avM == 1
					? formateazaNumar(avM) +
					  " bon fiscal emis " +
					  selectedRangeLabel.eticheta1
					: formateazaNumar(avM) +
					  " bonuri fiscale emise " +
					  selectedRangeLabel.eticheta1
			}
			bodyGeneralChart={emiseBonuri.map((b) => {
				return {
					titlu: `${b.numarBonFiscal}`,
					content: [
						{
							titlu: "Client: ",
							content: b.client?.numeClient ?? "",
						},
						{
							titlu: "Emis pentru spectacolul: ",
							content: b.spectacol?.titlu ?? "",
						},
						{
							titlu: "Suma platită: ",
							content: b.plata?.sumaPlatita + " RON",
						},
						{
							titlu: "Nr. Factură fiscală asociată: ",
							content:
								b.factura != undefined
									? "#" + b.factura.numarFactura
									: "Nu are factura asociată.",
						},
						{
							titlu: "Emis pe: ",
							content: capitalizeazaPrimaLitera(
								formateazaDataComplet(new Date(b.creatPe))
							),
						},
					],
				};
			})}
		/>
	);
}
