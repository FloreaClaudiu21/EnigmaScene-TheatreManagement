import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { prisma } from "@/lib/prismaClient";
import { BiletSpectacol } from "@/lib/types";
import {
	formatDateFull,
	formatNumber,
	getRangeOption,
} from "@/lib/rangeOptions";
import { TicketIcon } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";

export default async function TicketsStatCard({
	searchParams,
}: {
	searchParams: any;
}) {
	const queryKey = "ticketsStat";
	const selectedRangeLabel = getRangeOption(searchParams, queryKey);
	const bileteVandute: BiletSpectacol[] = await prisma.biletSpectacol.findMany({
		orderBy: {
			creatPe: "desc",
		},
		include: {
			client: true,
			salaSpectacol: true,
			locSalaSpectacol: true,
			spectacol: true,
			plata: {
				include: {
					rataDeSchimbValutar: true,
				},
			},
		},
	});
	let soldTicketsToday = bileteVandute;
	if (selectedRangeLabel.label != "Toate zilele") {
		soldTicketsToday = bileteVandute.filter((bilet) => {
			const dateNow = new Date();
			const dataCrearii = bilet.creatPe;
			return (
				dataCrearii >= (selectedRangeLabel.startDate ?? dateNow) &&
				dataCrearii < (selectedRangeLabel.endDate ?? dateNow)
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
			subtitle={`Total bilete vandute: ${formatNumber(bileteVandute.length)}`}
			body={
				avBilet == 1
					? formatNumber(avBilet) +
					  " bilet spectacol vandut " +
					  selectedRangeLabel.label1
					: formatNumber(avBilet) +
					  " bilete spectacol vandute " +
					  selectedRangeLabel.label1
			}
			bodyGeneralChart={soldTicketsToday.map((ticket) => {
				const cur = ticket.plata?.rataDeSchimbValutar;
				let priceConverted = ticket.pretVanzare ?? 0;
				if (cur ?? "RON" != "RON") {
					priceConverted /= ticket.plata?.rataDeSchimbValutar?.valuare ?? 1;
				}
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
							content: capitalizeFirstLetter(
								formatDateFull(new Date(ticket.spectacol?.oraIncepere ?? ""))
							),
						},
						{
							titlu: "Preț bilet: ",
							content: priceConverted.toFixed(2) + " " + cur?.moneda,
						},
						{
							titlu: "Preț achiziție: ",
							content: ticket.locSalaSpectacol?.pretLoc.toFixed(2) + " RON",
						},
						{
							titlu: "Cumpărat de: ",
							content: ticket.client?.numeClient ?? "",
						},
						{
							titlu: "Achiziționat pe: ",
							content: capitalizeFirstLetter(formatDateFull(ticket.creatPe)),
						},
					],
				};
			})}
		/>
	);
}
