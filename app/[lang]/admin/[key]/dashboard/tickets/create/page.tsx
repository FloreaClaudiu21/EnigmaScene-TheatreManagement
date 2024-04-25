import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminTicketNew from "./PageContent";

export default async function AdminTicketCreate({ params }: { params: any }) {
	const [clients, shows, tickets, exchanges] = await Promise.all([
		prisma.client.findMany({
			include: {
				billingAddresses: true,
			},
		}),
		prisma.show.findMany({
			include: {
				season: true,
				showType: true,
				showRoom: {
					include: {
						ticketsSold: true,
						seats: {
							include: {
								ticketsSold: {
									include: {
										show: {
											include: {
												season: true,
												showType: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		}),
		prisma.ticketSold.findMany({}),
		prisma.exchangeRate.findMany({}),
	]);
	return (
		<AdminTicketNew
			params={params}
			clients={clients}
			shows={shows}
			exchanges={exchanges}
			tickets={tickets}
		/>
	);
}
