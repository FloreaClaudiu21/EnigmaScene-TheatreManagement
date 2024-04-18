import { prisma } from "@/lib/prismaClient";
import { TicketSold } from "@prisma/client";

export default async function AdminTickets({ params }: { params: any }) {
	const tickets: TicketSold[] = await prisma.ticketSold.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			invoice: true,
			client: true,
			seat: true,
			payment: true,
			showRoom: true,
			ticketsVerified: true,
		},
	});
	return <></>;
}
