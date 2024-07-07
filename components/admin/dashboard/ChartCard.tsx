"use server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prismaClient";
import { startOfDay } from "date-fns";
import {
	obtineArrayDateGrafic,
	obtineOptiuneInterval,
} from "@/lib/intervaleOptiuni";
import { TipDateDiagrama, TipDiagrama, TipDiagramaT } from "@/lib/tipuri";
import { ChartCardContainer } from "./ChartCardContainer";

export async function ChartCard({
	title,
	queryKey,
	chartType,
	chartDataType,
	searchParams,
}: {
	title: string;
	queryKey: string;
	searchParams: any;
	chartType: TipDiagrama;
	chartDataType: TipDiagramaT;
}) {
	const selectedRangeLabel = obtineOptiuneInterval(searchParams, queryKey);
	async function getData(): Promise<TipDateDiagrama | undefined> {
		let response = undefined;
		const sr = selectedRangeLabel;
		switch (chartDataType) {
			case TipDiagramaT.UTILIZATORI_TOTALE: {
				const createdAtQuery: Prisma.ClientWhereInput["creatPe"] = {};
				if (sr.dataInceput) createdAtQuery.gte = sr.dataInceput;
				if (sr.dataSfarsit) createdAtQuery.lte = sr.dataSfarsit;
				const [chartData] = await Promise.all([
					prisma.client.findMany({
						select: { creatPe: true },
						where: { creatPe: createdAtQuery },
						orderBy: { creatPe: "asc" },
					}),
				]);
				const { array, format } = obtineArrayDateGrafic(
					sr.dataInceput || startOfDay(chartData[0].creatPe),
					sr.dataSfarsit || new Date()
				);
				const dayArray = array.map((date) => {
					return {
						numeCheie: format(date),
						cheieDate: 0,
					};
				});
				const chartDataMap = chartData.reduce((data, user) => {
					const formattedDate = format(user.creatPe);
					const entry = dayArray.find((day) => day.numeCheie === formattedDate);
					if (entry == null) return data;
					entry.cheieDate += 1;
					return data;
				}, dayArray);
				response = {
					data: chartDataMap,
				} as TipDateDiagrama;
				break;
			}
			case TipDiagramaT.VANZARI_TOTALE: {
				const createdAtQuery: Prisma.PlataWhereInput["creatPe"] = {};
				if (sr.dataInceput) createdAtQuery.gte = sr.dataInceput;
				if (sr.dataSfarsit) createdAtQuery.lte = sr.dataSfarsit;
				const [chartData] = await Promise.all([
					prisma.plata.findMany({
						select: { creatPe: true, sumaPlatita: true },
						where: { creatPe: createdAtQuery },
						orderBy: { creatPe: "asc" },
					}),
				]);
				const { array, format } = obtineArrayDateGrafic(
					sr.dataInceput || startOfDay(chartData[0].creatPe),
					sr.dataSfarsit || new Date()
				);
				const dayArray = array.map((date) => {
					return {
						numeCheie: format(date),
						cheieDate: 0,
					};
				});
				const chartDataMap = chartData.reduce((data, sale) => {
					const formattedDate = format(sale.creatPe);
					const entry = dayArray.find((day) => day.numeCheie === formattedDate);
					if (entry == null) return data;
					entry.cheieDate += sale.sumaPlatita;
					return data;
				}, dayArray);
				response = {
					data: chartDataMap,
				} as TipDateDiagrama;
				break;
			}
		}
		return response;
	}
	const data = await getData();
	return (
		<ChartCardContainer
			title={title}
			chartData={data}
			chartType={chartType}
			queryKey={queryKey}
			searchParams={searchParams}
			selectedRangeLabel={selectedRangeLabel}
		/>
	);
}
