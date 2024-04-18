import { columns } from "./columns";
import { prisma } from "@/lib/prismaClient";
import { Payment, TableTypes } from "@/lib/types";

export default async function AdminPayments({ params }: { params: any }) {
	const payments: Payment[] = await prisma.payment.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			invoice: true,
			client: true,
			ticket: true,
		},
	});
	return <></>;
}
