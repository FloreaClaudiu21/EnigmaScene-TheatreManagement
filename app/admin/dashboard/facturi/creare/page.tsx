import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminInvoiceNew from "./PageContent";
import { Plata } from "@/lib/types";

export default async function AdminInvoiceCreate() {
	const [payments] = await Promise.all([
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
	]);
	const foundPayments: Plata[] = payments.filter(
		(t) =>
			(t.factura == null || t.factura == undefined) && t.bonFiscal != undefined
	);
	return <AdminInvoiceNew payments={foundPayments} />;
}
