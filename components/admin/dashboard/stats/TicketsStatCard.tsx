import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { TicketIcon } from "lucide-react";
import { TicketSold } from "@/lib/types";
import { lastMonthAndThisMonthDates } from "@/lib/utils";
import { prisma } from "@/lib/prismaClient";

export default async function TicketsStatCard() {
	const dates = lastMonthAndThisMonthDates();
	const ticketsThisMonth: TicketSold[] = await prisma.ticketSold.findMany({
		where: {
			createdAt: {
				gte: dates.start,
				lte: dates.end,
			},
		},
	});
	const ticketsLastMonth: TicketSold[] = await prisma.ticketSold.findMany({
		where: {
			createdAt: {
				gte: dates.startLast,
				lte: dates.endLast,
			},
		},
	});
	const percentageChange =
		((ticketsThisMonth.length - ticketsLastMonth.length) /
			(ticketsLastMonth.length == 0 ? 1 : ticketsLastMonth.length)) *
		100;
	return (
		<GeneralStatCard
			title="Tickets Sold"
			icon={<TicketIcon className="h-6 w-6 text-muted-foreground" />}
			subtitle={"+" + ticketsThisMonth.length}
			subtitle_lastmonth={percentageChange.toFixed(2)}
		/>
	);
}
