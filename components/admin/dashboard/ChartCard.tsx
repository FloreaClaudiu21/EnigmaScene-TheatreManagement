"use server";
import { Prisma } from "@prisma/client";
import { ChartCardContainer } from "./ChartCardContainer";
import { ChartDataTip, ChartDataType, ChartTip } from "@/lib/types";
import { getChartDateArray, getRangeOption } from "@/lib/rangeOptions";
import { prisma } from "@/lib/prismaClient";
import { startOfDay } from "date-fns";

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
	chartType: ChartTip;
	chartDataType: ChartDataTip;
}) {
	const selectedRangeLabel = getRangeOption(searchParams, queryKey);
	async function getData(): Promise<ChartDataType | undefined> {
		let response = undefined;
		const sr = selectedRangeLabel;
		switch (chartDataType) {
			case ChartDataTip.TOTAL_USERS: {
				const createdAtQuery: Prisma.ClientWhereInput["creatPe"] = {};
				if (sr.startDate) createdAtQuery.gte = sr.startDate;
				if (sr.endDate) createdAtQuery.lte = sr.endDate;
				const [chartData] = await Promise.all([
					prisma.client.findMany({
						select: { creatPe: true },
						where: { creatPe: createdAtQuery },
						orderBy: { creatPe: "asc" },
					}),
				]);
				const { array, format } = getChartDateArray(
					sr.startDate || startOfDay(chartData[0].creatPe),
					sr.endDate || new Date()
				);
				const dayArray = array.map((date) => {
					return {
						nameKey: format(date),
						dataKey: 0,
					};
				});
				const chartDataMap = chartData.reduce((data, user) => {
					const formattedDate = format(user.creatPe);
					const entry = dayArray.find((day) => day.nameKey === formattedDate);
					if (entry == null) return data;
					entry.dataKey += 1;
					return data;
				}, dayArray);
				response = {
					data: chartDataMap,
				} as ChartDataType;
				break;
			}
			case ChartDataTip.TOTAL_SALES: {
				const createdAtQuery: Prisma.PlataWhereInput["creatPe"] = {};
				if (sr.startDate) createdAtQuery.gte = sr.startDate;
				if (sr.endDate) createdAtQuery.lte = sr.endDate;
				const [chartData] = await Promise.all([
					prisma.plata.findMany({
						select: { creatPe: true, sumaPlatita: true },
						where: { creatPe: createdAtQuery },
						orderBy: { creatPe: "asc" },
					}),
				]);
				const { array, format } = getChartDateArray(
					sr.startDate || startOfDay(chartData[0].creatPe),
					sr.endDate || new Date()
				);
				const dayArray = array.map((date) => {
					return {
						nameKey: format(date),
						dataKey: 0,
					};
				});
				const chartDataMap = chartData.reduce((data, sale) => {
					const formattedDate = format(sale.creatPe);
					const entry = dayArray.find((day) => day.nameKey === formattedDate);
					if (entry == null) return data;
					entry.dataKey += sale.sumaPlatita;
					return data;
				}, dayArray);
				response = {
					data: chartDataMap,
				} as ChartDataType;
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
