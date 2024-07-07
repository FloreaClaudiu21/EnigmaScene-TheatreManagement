import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import AdminTicketSoldEdit from "./PageContent";
import { esteNumeric } from "@/lib/metodeUtile";

export default async function AdminTicketEditPage({ params }: { params: any }) {
	let id = params.ticketID;
	if (!id) return notFound();
	if (!esteNumeric(id)) return notFound();
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
			salaSpectacol: {
				include: {
					locuriSala: {
						include: {
							bileteVandute: true,
						},
					},
				},
			},
			plata: true,
			spectacol: true,
		},
	});
	if (!found) {
		return notFound();
	}
	const [clients] = await Promise.all([
		prisma.client.findMany({
			include: {
				adreseFacturare: true,
			},
		}),
	]);
	return <AdminTicketSoldEdit clients={clients} ticket={found} />;
}
