import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminInvoiceNew from "./PageContent";
import { Plata } from "@/lib/tipuri";

export default async function AdminInvoiceCreate() {
	const [payments, lastInvoice] = await Promise.all([
		prisma.plata.findMany({
			include: {
				factura: true,
				client: {
					include: {
						adreseFacturare: true,
					},
				},
				bonFiscal: true,
			},
		}),
		prisma.facturaFiscala.findFirst({
			include: {
				bonFiscal: true,
			},
			orderBy: {
				codFactura: "desc",
			},
			take: 1,
		}),
	]);
	const foundPayments: Plata[] = payments.filter(
		(t) =>
			(t.factura == null || t.factura == undefined) && t.bonFiscal != undefined
	);
	return <AdminInvoiceNew payments={foundPayments} lastInvoice={lastInvoice} />;
}
