import { prisma } from "@/lib/prismaClient";
import {
	MaterialDecorSpectacol,
	MaterialDecorSpectacolFolosit,
} from "@/lib/types";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { PaintRollerIcon } from "lucide-react";
import {
	formatDateFull,
	formatNumber,
	getRangeOption,
} from "@/lib/rangeOptions";
import { capitalizeFirstLetter } from "@/lib/utils";

export default async function DecoMaterialsStatCard({
	searchParams,
}: {
	searchParams: any;
}) {
	const queryKey = "decoMaterialStat";
	const selectedRangeLabel = getRangeOption(searchParams, queryKey);
	const materialeDeco: MaterialDecorSpectacol[] = await prisma.materialDecorSpectacol.findMany();
	const materialeFolosite: MaterialDecorSpectacolFolosit[] = await prisma.materialDecorSpectacolFolosit.findMany(
		{
			orderBy: {
				dataFolosirii: "desc",
			},
			include: {
				materialDecorSpectacol: {
					include: {
						categorieMaterialDecor: true,
					},
				},
			},
		}
	);
	let usedMaterialsToday = materialeFolosite;
	if (selectedRangeLabel.label != "Toate zilele") {
		usedMaterialsToday = materialeFolosite.filter((mat) => {
			const dateNow = new Date();
			const dataCrearii = new Date(mat.dataFolosirii);
			return (
				dataCrearii >= (selectedRangeLabel.startDate ?? dateNow) &&
				dataCrearii < (selectedRangeLabel.endDate ?? dateNow)
			);
		});
	}
	const avM = usedMaterialsToday.length;
	return (
		<GeneralStatCard
			queryKey={queryKey}
			searchParams={searchParams}
			title="Materiale Decor Folosite"
			selectedRangeLabel={selectedRangeLabel}
			icon={<PaintRollerIcon className="h-6 w-6 text-muted-foreground" />}
			subtitle={`Total materiale decor: ${formatNumber(materialeDeco.length)}`}
			body={
				avM == 1
					? formatNumber(avM) +
					  " material decor folosit " +
					  selectedRangeLabel.label1
					: formatNumber(avM) +
					  " materiale decor folosite " +
					  selectedRangeLabel.label1
			}
			bodyGeneralChart={usedMaterialsToday.map((mat) => {
				return {
					titlu: `${mat.cantitateaFolosita} x
					${mat.materialDecorSpectacol?.numeMaterial}`,
					content: [
						{
							titlu: "Folosit la spectacolul: ",
							content: mat.spectacol?.titlu ?? "",
						},
						{
							titlu: "Cantitatea folosită: ",
							content:
								mat.cantitateaFolosita +
								" " +
								mat.materialDecorSpectacol?.unitateMastura,
						},
						{
							titlu: "Cantitatea rămasa pe stoc la moment: ",
							content:
								mat.cantitateaRamasaPeStoc +
								" " +
								mat.materialDecorSpectacol?.unitateMastura,
						},
						{
							titlu: "Folosit pe: ",
							content: capitalizeFirstLetter(
								formatDateFull(new Date(mat.dataFolosirii))
							),
						},
					],
				};
			})}
		/>
	);
}
