import { prisma } from "@/lib/prismaClient";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { DramaIcon } from "lucide-react";
import {
	formatDateFull,
	formatNumber,
	getRangeOption,
} from "@/lib/rangeOptions";
import { Spectacol } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import Image from "next/image";

export default async function ShowsStatCard({
	searchParams,
}: {
	searchParams: any;
}) {
	const queryKey = "showsStat";
	const selectedRangeLabel = getRangeOption(searchParams, queryKey);
	const shows: Spectacol[] = await prisma.spectacol.findMany({
		include: {
			salaSpectacol: {
				include: {
					locuriSala: true,
				},
			},
			tipSpectacol: true,
			sezon: true,
			bileteVandute: true,
		},
	});
	const availableShows = shows.filter((show) => {
		const dateNow = new Date();
		const dataCrearii = show.creatPe;
		return (
			dataCrearii >= (selectedRangeLabel.startDate ?? dateNow) &&
			dataCrearii < (selectedRangeLabel.endDate ?? dateNow)
		);
	});
	const avS = availableShows.length;
	return (
		<GeneralStatCard
			queryKey={queryKey}
			searchParams={searchParams}
			title="Spectacole Disponibile"
			selectedRangeLabel={selectedRangeLabel}
			icon={<DramaIcon className="h-6 w-6 text-muted-foreground" />}
			subtitle={`Total spectacole: ${formatNumber(shows.length)}`}
			body={
				avS == 1
					? formatNumber(avS) +
					  " spectacol adăugat " +
					  selectedRangeLabel.label1
					: formatNumber(avS) +
					  " spectacole adăugate " +
					  selectedRangeLabel.label1
			}
			bodyGeneralChart={
				<div className="flex flex-col gap-2">
					{availableShows.length > 0 ? (
						availableShows.map((show) => {
							return (
								<div
									key={show.titlu}
									className="flex items-start gap-4 overflow-hidden border-b-1 pb-2"
								>
									<div className="grid gap-1 overflow-hidden break-all">
										<div className="w-full place-self-start justify-self-start mb-2 min-w-28 min-h-24">
											<Image
												height={100}
												width={210}
												alt="No Photo"
												src={show.imagine}
												className="h-24 object-fill rounded-sm"
											/>
										</div>
										<p className="text-lg font-semibold leading-none text-red-500">
											{show.titlu}
										</p>
										<div>
											<p className="text-sm text-muted-foreground">
												{"Descriere scurta: " + show.descriereScurta}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Tip & Sezon spectacol: " +
													show.sezon?.numeSezon +
													" - " +
													show.tipSpectacol?.numeTip}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Sală spectacol: " + show.salaSpectacol?.numarSala}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Locuri ramase: " +
													(show.bileteVandute?.length ?? 0) +
													"/" +
													show.salaSpectacol?.locuriSala?.length ?? 0}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Spectacolul incepe pe: " +
													capitalizeFirstLetter(
														formatDateFull(new Date(show.oraIncepere ?? ""))
													)}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Adaugat pe: " +
													capitalizeFirstLetter(formatDateFull(show.creatPe))}
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
