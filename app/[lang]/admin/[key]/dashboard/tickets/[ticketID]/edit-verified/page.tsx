import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import AdminTicketVerifyEdit from "./PageContent";
import { TicketSold } from "@/lib/types";
import { isNumeric } from "@/lib/utils";

export default async function AdminTicketVerifiedEditPage({
	params,
}: {
	params: any;
}) {
	let id = params.ticketID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const found = await prisma.ticketVerified.findFirst({
		where: {
			id,
		},
		include: {
			ticketSold: true,
		},
	});
	if (!found) return notFound();
	const tickets = await prisma.ticketSold.findMany({
		include: {
			ticketVerified: true,
		},
	});
	const alltickets: TicketSold[] = tickets.filter(
		(t) => t.ticketVerified == null || t.ticketVerified == undefined
	);
	alltickets.push(found.ticketSold);
	return (
		<AdminTicketVerifyEdit
			params={params}
			ticket={found}
			tickets={alltickets}
		/>
	);
}
