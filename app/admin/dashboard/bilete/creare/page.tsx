import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminTicketNew from "./PageContent";
import { Spectacol } from "@/lib/types";

export default async function AdminTicketCreate() {
	const spectacole = await prisma.spectacol.findMany({
		include: {
			sezon: true,
			tipSpectacol: true,
			bileteVandute: {
				include: {
					client: true,
					salaSpectacol: true,
					locSalaSpectacol: true,
					spectacol: true,
				},
			},
			salaSpectacol: {
				include: {
					locuriSala: true,
				},
			},
		},
	});
	const spectacoleFiltrate: Spectacol[] = spectacole.filter((spectacol) => {
		const oraTerminare = new Date(spectacol.oraTerminare);
		return oraTerminare > new Date();
	});
	const clienti = await prisma.client.findMany({
		include: {
			adreseFacturare: true,
		},
	});
	return <AdminTicketNew clienti={clienti} spectacole={spectacoleFiltrate} />;
}
