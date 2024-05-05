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
		include: {
			client: true,
			salaSpectacol: true,
			locSalaSpectacol: true,
			spectacol: true,
		},
	});
	const soldTicketsToday = bileteVandute.filter((bilet) => {
		const dateNow = new Date();
		const dataCrearii = bilet.creatPe;
		return (
			dataCrearii >= (selectedRangeLabel.startDate ?? dateNow) &&
			dataCrearii < (selectedRangeLabel.endDate ?? dateNow)
		);
	});
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
			bodyGeneralChart={
				<div className="flex flex-col gap-2">
					{soldTicketsToday.length > 0 ? (
						soldTicketsToday.map((ticket) => {
							return (
								<div
									key={ticket.codBiletSpectacol}
									className="flex items-start gap-4 overflow-hidden border-b-1 pb-2"
								>
									<div className="grid gap-1 overflow-hidden break-all">
										<p className="text-lg font-semibold leading-none text-red-500">
											1 x {ticket.spectacol?.titlu}
										</p>
										<div>
											<p className="text-sm text-muted-foreground">
												{"Sală spectacol: " + ticket.salaSpectacol?.numarSala}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Nr. Loc & Rand: " +
													ticket.locSalaSpectacol?.numarLoc +
													" - " +
													ticket.locSalaSpectacol?.rand}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Preț bilet: " +
													ticket.locSalaSpectacol?.pretLoc +
													" RON"}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Spectacolul incepe pe: " +
													capitalizeFirstLetter(
														formatDateFull(
															new Date(ticket.spectacol?.oraIncepere ?? "")
														)
													)}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Achiziționat pe: " +
													capitalizeFirstLetter(formatDateFull(ticket.creatPe))}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Cumpărat de: " + ticket.client?.numeClient}
											</p>
										</div>
									</div>
									<div className="ml-auto font-medium text-right"></div>
								</div>
							);
						})
					) : (
						<>Nu au fost găsite înregistrări.</>
					)}
				</div>
			}
		/>
	);
}
