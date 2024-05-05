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
	const found = await prisma.biletSpectacol.findFirst({
		where: {
			codBiletSpectacol: id,
		},
		include: {
			locSalaSpectacol: true,
			bonFiscal: true,
			client: true,
			factura: true,
			plata: {
				include: {
					rataDeSchimbValutar: true,
				},
			},
			salaSpectacol: {
				include: {
					locuriSala: {
						include: {
							bileteVandute: true,
						},
					},
				},
			},
			spectacol: true,
		},
	});
	if (!found) {
		return notFound();
	}
	const [clients, exchanges] = await Promise.all([
		prisma.client.findMany({
			include: {
				adreseFacturare: true,
			},
		}),
		prisma.rataDeSchimbValutar.findMany({}),
	]);
	return (
		<AdminTicketSoldEdit
			clients={clients}
			exchanges={exchanges}
			ticket={found}
		/>
	);
}
