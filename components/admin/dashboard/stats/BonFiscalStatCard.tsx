import { prisma } from "@/lib/prismaClient";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { PaintRollerIcon, StickyNoteIcon } from "lucide-react";
import {
	formatDateFull,
	formatNumber,
	getRangeOption,
} from "@/lib/rangeOptions";
import { capitalizeFirstLetter } from "@/lib/utils";
import { BonFiscal } from "@/lib/types";

export default async function BonuriFiscaleStatCard({
	searchParams,
}: {
	searchParams: any;
}) {
	let emiseBonuri: BonFiscal[] = [];
	const queryKey = "fiscalReceipt";
	const selectedRangeLabel = getRangeOption(searchParams, queryKey);
	const bonuri: BonFiscal[] = await prisma.bonFiscal.findMany({
		include: {
			plata: true,
			client: true,
			spectacol: true,
		},
	});
	if (selectedRangeLabel.label != "Toate zilele") {
		emiseBonuri = bonuri.filter((b) => {
			const dateNow = new Date();
			const dataCrearii = new Date(b.creatPe);
			return (
				dataCrearii >= (selectedRangeLabel.startDate ?? dateNow) &&
				dataCrearii < (selectedRangeLabel.endDate ?? dateNow)
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
			subtitle={`Total bonuri fiscale: ${formatNumber(bonuri.length)}`}
			body={
				avM == 1
					? formatNumber(avM) + " bon fiscal emis " + selectedRangeLabel.label1
					: formatNumber(avM) +
					  " bonuri fiscale emise " +
					  selectedRangeLabel.label1
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
							titlu: "Factură fiscală asociată: ",
							content:
								b.factura != undefined
									? b.factura.numarFactura
									: "Nu are factura asociată.",
						},
						{
							titlu: "Emis pe: ",
							content: capitalizeFirstLetter(
								formatDateFull(new Date(b.creatPe))
							),
						},
					],
				};
			})}
		/>
	);
}
