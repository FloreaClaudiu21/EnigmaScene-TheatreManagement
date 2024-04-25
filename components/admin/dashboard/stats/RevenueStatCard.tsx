import { prisma } from "@/lib/prismaClient";
import { Payment } from "@/lib/types";
import React from "react";
import GeneralStatCard from "./GeneralStatCard";
import { DollarSign } from "lucide-react";
import { lastMonthAndThisMonthDates } from "@/lib/utils";

export default async function RevenueStatCard() {
	const dates = lastMonthAndThisMonthDates();
	const paymentsThisMonth: Payment[] = await prisma.payment.findMany({
		where: {
			paidAt: {
				gte: dates.start,
				lte: dates.end,
			},
		},
	});
	const paymentsLastMonth: Payment[] = await prisma.payment.findMany({
		where: {
			paidAt: {
				gte: dates.startLast,
				lte: dates.endLast,
			},
		},
	});
	const revenueThisMonth = paymentsThisMonth.reduce(
		(total, payment) => total + payment.amount,
		0
	);
	const revenueLastMonth = paymentsLastMonth.reduce(
		(total, payment) => total + payment.amount,
		0
	);
	const percentageChange =
		((revenueThisMonth - revenueLastMonth) /
			(revenueLastMonth == 0 ? 1 : revenueLastMonth)) *
		100;
	return (
		<GeneralStatCard
			title="Total Revenue"
			icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
			subtitle={revenueThisMonth.toFixed(2) + " RON"}
			subtitle_lastmonth={percentageChange.toFixed(2)}
		/>
	);
}
