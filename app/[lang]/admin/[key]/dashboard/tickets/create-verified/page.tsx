import { prisma } from "@/lib/prismaClient";
import { TicketSold } from "@/lib/types";
import React from "react";
import TicketCreateVerifiedAdmin from "./PageContent";

export default async function CreateTicketVerified({
	params,
}: {
	params: any;
}) {
	const ticketsSold: TicketSold[] = await prisma.ticketSold.findMany({
		include: {
			ticketVerified: true,
		},
	});
	const tickets = ticketsSold.filter(
		(v) => v.ticketVerified == undefined || v.ticketVerified == null
	);
	return <TicketCreateVerifiedAdmin params={params} tickets={tickets} />;
}
