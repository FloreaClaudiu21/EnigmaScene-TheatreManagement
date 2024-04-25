import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminInvoiceNew from "./PageContent";
import { TicketSold } from "@/lib/types";

export default async function AdminInvoiceCreate({ params }: { params: any }) {
	const [tickets] = await Promise.all([
		prisma.ticketSold.findMany({
			include: {
				client: {
					include: {
						billingAddresses: true,
					},
				},
				payment: true,
				fiscalReceipt: true,
				invoice: true,
			},
		}),
	]);
	const foundTickets: TicketSold[] = tickets.filter(
		(t) => t.invoice == null || t.invoice == undefined
	);
	return <AdminInvoiceNew params={params} tickets={foundTickets} />;
}
