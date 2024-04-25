import { prisma } from "@/lib/prismaClient";
import React from "react";
import { TicketSold } from "@/lib/types";
import { notFound } from "next/navigation";
import AdminInvoiceEditAdmin from "./PageContent";
import { isNumeric } from "@/lib/utils";

export default async function AdminInvoiceEdit({ params }: { params: any }) {
	let id = params.invoiceID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const invoice = await prisma.invoice.findFirst({
		where: {
			id,
		},
		include: {
			client: true,
			payment: true,
			ticket: true,
			fiscalReceipt: true,
		},
	});
	if (!invoice) return notFound();
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
		(t) =>
			t.invoice == null || t.invoice == undefined || t.id == invoice?.ticketId
	);
	return (
		<AdminInvoiceEditAdmin
			invoice={invoice}
			params={params}
			tickets={foundTickets}
		/>
	);
}
