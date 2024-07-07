import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { prisma } from "@/lib/prismaClient";
import { BiletSpectacol } from "@/lib/tipuri";
import {
	formateazaDataComplet,
	formateazaNumar,
	obtineOptiuneInterval,
} from "@/lib/intervaleOptiuni";
import { TicketIcon } from "lucide-react";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";

export default async function BileteStatCard({
	searchParams,
}: {
	searchParams: any;
}) {
	const queryKey = "ticketsStat";
	const selectedRangeLabel = obtineOptiuneInterval(searchParams, queryKey);
	const bileteVandute: BiletSpectacol[] = await prisma.biletSpectacol.findMany({
		orderBy: {
			creatPe: "desc",
		},
		include: {
			client: true,
			salaSpectacol: true,
			bonFiscal: {
				include: {
					plata: true,
				},
			},
			locSalaSpectacol: true,
			spectacol: true,
			plata: true,
		},
	});
	let soldTicketsToday = bileteVandute;
	if (selectedRangeLabel.eticheta != "Toate zilele") {
		soldTicketsToday = bileteVandute.filter((bilet) => {
			const dateNow = new Date();
			const dataCrearii = bilet.creatPe;
			return (
				dataCrearii >= (selectedRangeLabel.dataInceput ?? dateNow) &&
				dataCrearii < (selectedRangeLabel.dataSfarsit ?? dateNow)
			);
		});
	}
	const avBilet = soldTicketsToday.length;
	return (
		<GeneralStatCard
			queryKey={queryKey}
			searchParams={searchParams}
			title="Bilete Vandute la Spectacole"
			selectedRangeLabel={selectedRangeLabel}
			icon={<TicketIcon className="h-6 w-6 text-muted-foreground" />}
			subtitle={`Total bilete vandute: ${formateazaNumar(
				bileteVandute.length
			)}`}
			body={
				avBilet == 1
					? formateazaNumar(avBilet) +
					  " bilet spectacol vandut " +
					  selectedRangeLabel.eticheta1
					: formateazaNumar(avBilet) +
					  " bilete spectacol vandute " +
					  selectedRangeLabel.eticheta1
			}
			bodyGeneralChart={soldTicketsToday.map((ticket) => {
				let priceConverted = ticket.pretVanzare ?? 0;
				return {
					titlu: `1 x ${ticket.spectacol?.titlu}`,
					content: [
						{
							titlu: "Sală spectacol: ",
							content: ticket.salaSpectacol?.numarSala ?? "",
						},
						{
							titlu: "Nr. Loc & Rand: ",
							content:
								ticket.locSalaSpectacol?.numarLoc +
								" - " +
								ticket.locSalaSpectacol?.rand,
						},
						{
							titlu: "Spectacolul incepe pe: ",
							content: capitalizeazaPrimaLitera(
								formateazaDataComplet(
									new Date(ticket.spectacol?.oraIncepere ?? "")
								)
							),
						},
						{
							titlu: "Preț bilet: ",
							content: priceConverted.toFixed(2) + " RON",
						},
						{
							titlu: "Preț achiziție: ",
							content: ticket.locSalaSpectacol?.pretLoc.toFixed(2) + " RON",
						},
						{
							titlu: "Nr. bon fiscal: ",
							content:
								ticket.bonFiscal?.numarBonFiscal ??
								"Nu este asociat cu un bon fiscal.",
						},
						{
							titlu: "Preț bon fiscal: ",
							content: ticket.bonFiscal?.plata?.sumaPlatita.toFixed(2) + " RON",
						},
						{
							titlu: "Cumpărat de: ",
							content: ticket.client?.numeClient ?? "",
						},
						{
							titlu: "Achiziționat pe: ",
							content: capitalizeazaPrimaLitera(
								formateazaDataComplet(ticket.creatPe)
							),
						},
					],
				};
			})}
		/>
	);
}
