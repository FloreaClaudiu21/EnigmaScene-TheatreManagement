import { prisma } from "@/lib/prismaClient";
import { ShowMaterialDecorationUsed } from "@/lib/types";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { PaintRollerIcon } from "lucide-react";
import { lastMonthAndThisMonthDates } from "@/lib/utils";

export default async function DecoMaterialsStatCard() {
	const dates = lastMonthAndThisMonthDates();
	const matThisMonth: ShowMaterialDecorationUsed[] = await prisma.showMaterialDecorationUsed.findMany(
		{
			where: {
				createdAt: {
					gte: dates.start,
					lte: dates.end,
				},
			},
		}
	);
	const matLastMonth: ShowMaterialDecorationUsed[] = await prisma.showMaterialDecorationUsed.findMany(
		{
			where: {
				createdAt: {
					gte: dates.startLast,
					lte: dates.endLast,
				},
			},
		}
	);
	const percentageChange =
		((matThisMonth.length - matLastMonth.length) /
			(matLastMonth.length == 0 ? 1 : matLastMonth.length)) *
		100;
	return (
		<GeneralStatCard
			title="Decoration Materials Used"
			icon={<PaintRollerIcon className="h-6 w-6 text-muted-foreground" />}
			subtitle={matThisMonth.length + ""}
			subtitle_lastmonth={percentageChange.toFixed(2)}
		/>
	);
}
