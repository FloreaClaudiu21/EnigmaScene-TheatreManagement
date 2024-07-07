import { prisma } from "@/lib/prismaClient";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { DramaIcon } from "lucide-react";
import { Spectacol } from "@/lib/tipuri";
import {
	formateazaDataComplet,
	formateazaNumar,
	obtineOptiuneInterval,
} from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";

export default async function SpectacoleStatCard({
	searchParams,
}: {
	searchParams: any;
}) {
	const queryKey = "showsStat";
	const selectedRangeLabel = obtineOptiuneInterval(searchParams, queryKey);
	const shows: Spectacol[] = await prisma.spectacol.findMany({
		orderBy: {
			creatPe: "desc",
		},
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
	let availableShows = shows;
	if (selectedRangeLabel.eticheta != "Toate zilele") {
		availableShows = shows.filter((show) => {
			const dateNow = new Date();
			const dataCrearii = show.creatPe;
			return (
				dataCrearii >= (selectedRangeLabel.dataInceput ?? dateNow) &&
				dataCrearii < (selectedRangeLabel.dataSfarsit ?? dateNow)
			);
		});
	}
	const avS = availableShows.length;
	return (
		<GeneralStatCard
			queryKey={queryKey}
			searchParams={searchParams}
			title="Spectacole Disponibile"
			selectedRangeLabel={selectedRangeLabel}
			icon={<DramaIcon className="h-6 w-6 text-muted-foreground" />}
			subtitle={`Total spectacole: ${formateazaNumar(shows.length)}`}
			body={
				avS == 1
					? formateazaNumar(avS) +
					  " spectacol adăugat " +
					  selectedRangeLabel.eticheta1
					: formateazaNumar(avS) +
					  " spectacole adăugate " +
					  selectedRangeLabel.eticheta1
			}
			bodyGeneralChart={availableShows.map((show) => {
				return {
					titlu: show.titlu ?? "",
					content: [
						{
							titlu: "Descriere scurtă: ",
							content: show.descriereScurta,
						},
						{
							titlu: "Regizat de: ",
							content: show.director,
						},
						{
							titlu: "Actorii: ",
							content: show.actorii,
						},
						{
							titlu: "Tip & Sezon Spectacol: ",
							content:
								show.sezon?.numeSezon + " - " + show.tipSpectacol?.numeTip,
						},
						{
							titlu: "Sală spectacol: ",
							content: show.salaSpectacol?.numarSala ?? "",
						},
						{
							titlu: "Locuri rămase: ",
							content:
								(show.bileteVandute?.length ?? 0) +
									"/" +
									show.salaSpectacol?.locuriSala?.length ?? 0,
						},
						{
							titlu: "Spectacolul incepe pe: ",
							content: capitalizeazaPrimaLitera(
								formateazaDataComplet(new Date(show.oraIncepere ?? ""))
							),
						},
						{
							titlu: "Adăugat pe: ",
							content: capitalizeazaPrimaLitera(
								formateazaDataComplet(show.creatPe)
							),
						},
					],
				};
			})}
		/>
	);
}
