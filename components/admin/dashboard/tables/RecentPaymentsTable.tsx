import { prisma } from "@/lib/prismaClient";
import React from "react";
import { Plata } from "@/lib/tipuri";
import PlatiTabelContainer from "./PlatiTabelContainer";

export default async function PlatiRecenteTabel() {
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
	return <PlatiTabelContainer platii={payments} />;
}
