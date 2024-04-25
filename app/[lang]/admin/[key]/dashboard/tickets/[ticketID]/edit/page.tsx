import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import AdminTicketSoldEdit from "./PageContent";
import { isNumeric } from "@/lib/utils";

export default async function AdminTicketEditPage({ params }: { params: any }) {
	let id = params.ticketID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const found = await prisma.ticketSold.findFirst({
		where: {
			id,
		},
		include: {
			invoice: true,
			showRoom: true,
			seat: true,
			payment: {
				include: {
					client: true,
				},
			},
			show: {
				include: {
					showType: true,
					season: true,
					showRoom: true,
				},
			},
		},
	});
	if (!found) {
		return notFound();
	}
	const [clients, shows, exchanges] = await Promise.all([
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
		prisma.exchangeRate.findMany({}),
	]);
	return (
		<AdminTicketSoldEdit
			clients={clients}
			exchanges={exchanges}
			params={params}
			shows={shows}
			ticket={found}
		/>
	);
}
