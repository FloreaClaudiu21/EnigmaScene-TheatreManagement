import { prisma } from "@/lib/prismaClient";
import { Invoice } from "@/lib/types";

export default async function AdminInvoices({ params }: { params: any }) {
	const invoices: Invoice[] = await prisma.invoice.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			client: true,
			payment: true,
			ticket: true,
		},
	});
	return <></>;
}
