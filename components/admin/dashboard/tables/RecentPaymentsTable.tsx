import { prisma } from "@/lib/prismaClient";
import { Plata } from "@/lib/types";
import React from "react";
import PaymentsContainerTable from "./PaymentsContainerTable";

export default async function RecentPaymentsTable() {
	const payments: Plata[] = await prisma.plata.findMany({
		take: 10,
		orderBy: {
			platitPe: "desc",
		},
		include: {
			client: true,
			factura: true,
		},
	});
	return <PaymentsContainerTable payments={payments} />;
}
