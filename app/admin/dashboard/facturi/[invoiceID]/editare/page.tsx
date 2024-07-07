import { prisma } from "@/lib/prismaClient";
import React from "react";
import { notFound } from "next/navigation";
import AdminInvoiceEditAdmin from "./PageContent";
import { esteNumeric } from "@/lib/metodeUtile";

export default async function AdminInvoiceEdit({ params }: { params: any }) {
	let id = params.invoiceID;
	if (!id) return notFound();
	if (!esteNumeric(id)) return notFound();
	id = parseInt(id);
	const invoice = await prisma.facturaFiscala.findFirst({
		where: {
			codFactura: id,
		},
		include: {
			client: {
				include: {
					adreseFacturare: true,
				},
			},
			plata: true,
			bonFiscal: true,
		},
	});
	if (!invoice) return notFound();
	return <AdminInvoiceEditAdmin invoice={invoice} />;
}
