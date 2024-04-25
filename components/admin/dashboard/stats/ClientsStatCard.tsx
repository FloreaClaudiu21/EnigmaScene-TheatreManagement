import { prisma } from "@/lib/prismaClient";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { User2Icon } from "lucide-react";
import { Client } from "next-auth";
import { lastMonthAndThisMonthDates } from "@/lib/utils";

export default async function ClientsStatCard() {
	const dates = lastMonthAndThisMonthDates();
	const clientsThisMonth: Client[] = await prisma.client.findMany({
		where: {
			createdAt: {
				gte: dates.start,
				lte: dates.end,
			},
		},
	});
	const clientsLastMonth: Client[] = await prisma.client.findMany({
		where: {
			createdAt: {
				gte: dates.startLast,
				lte: dates.endLast,
			},
		},
	});
	const percentageChange =
		((clientsThisMonth.length - clientsLastMonth.length) /
			(clientsLastMonth.length == 0 ? 1 : clientsLastMonth.length)) *
		100;
	return (
		<GeneralStatCard
			title="New Clients"
			icon={<User2Icon className="h-6 w-6 text-muted-foreground" />}
			subtitle={"+" + clientsThisMonth.length}
			subtitle_lastmonth={percentageChange.toFixed(2)}
		/>
	);
}
