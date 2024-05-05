import { prisma } from "@/lib/prismaClient";
import {
	MaterialDecorSpectacol,
	MaterialDecorSpectacolFolosit,
} from "@/lib/types";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { PaintRollerIcon } from "lucide-react";
import {
	formatDate,
	formatDateFull,
	formatNumber,
	getRangeOption,
} from "@/lib/rangeOptions";

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
			include: {
				materialDecorSpectacol: {
					include: {
						categorieMaterialDecor: true,
					},
				},
			},
		}
	);
	const usedMaterialsToday = materialeFolosite.filter((mat) => {
		const dateNow = new Date();
		const dataCrearii = new Date(mat.dataFolosirii);
		return (
			dataCrearii >= (selectedRangeLabel.startDate ?? dateNow) &&
			dataCrearii < (selectedRangeLabel.endDate ?? dateNow)
		);
	});
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
			bodyGeneralChart={
				<div className="flex flex-col gap-2">
					{usedMaterialsToday.length > 0 ? (
						usedMaterialsToday.map((mat) => {
							return (
								<div
									key={mat.codMaterialDecorSpectacol}
									className="flex items-start gap-4 overflow-hidden border-b-1 pb-2"
								>
									<div className="grid gap-1 overflow-hidden break-all">
										<p className="text-lg font-semibold leading-none text-red-500">
											{mat.cantitateaFolosita} x{" "}
											{mat.materialDecorSpectacol?.numeMaterial}
										</p>
										<p className="text-md text-muted-foreground">
											{"Folosit la spectacolul: " + mat.spectacol?.titlu}
										</p>
										<div>
											<p className="text-sm text-muted-foreground">
												{"Cantitatea folosită: " +
													mat.cantitateaFolosita +
													" " +
													mat.materialDecorSpectacol?.unitateMastura}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Cantitatea rămasa pe stoc la moment: " +
													mat.cantitateaRamasaPeStoc +
													" " +
													mat.materialDecorSpectacol?.unitateMastura}
											</p>
											<p className="text-sm text-muted-foreground">
												{"Folosit pe: " +
													formatDateFull(new Date(mat.dataFolosirii))}
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
