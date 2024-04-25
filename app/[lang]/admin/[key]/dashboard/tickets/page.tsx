import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { TableTypes, TicketVerified } from "@/lib/types";
import { TicketSold } from "@prisma/client";
import { columnsTicketsSold } from "./columnsTicketsSold";
import { columnsTicketsVerified } from "./columnsTicketsVerified";

export default async function AdminTickets({ params }: { params: any }) {
	const ticketsSold: TicketSold[] = await prisma.ticketSold.findMany({
		include: {
			invoice: {
				include: {
					ticket: {
						include: {
							seat: true,
							showRoom: true,
							show: {
								include: {
									season: true,
									showType: true,
									showRoom: true,
								},
							},
						},
					},
				},
			},
			client: true,
			seat: true,
			payment: true,
			show: true,
			showRoom: true,
			fiscalReceipt: {
				include: {
					show: {
						include: {
							season: true,
							showType: true,
							showRoom: true,
						},
					},
					ticket: true,
					client: true,
					invoice: true,
					payment: true,
				},
			},
			ticketVerified: true,
		},
	});
	const ticketsVerified: TicketVerified[] = await prisma.ticketVerified.findMany(
		{
			orderBy: {
				verifiedAt: "desc",
			},
			include: {
				ticketSold: {
					include: {
						seat: true,
						showRoom: true,
						show: {
							include: {
								season: true,
								showType: true,
								showRoom: true,
							},
						},
						payment: true,
						invoice: true,
						fiscalReceipt: true,
					},
				},
			},
		}
	);
	return (
		<TabsPages
			defVal="ticketsAll"
			tabs={[
				{
					name: "All Sold Tickets",
					value: "ticketsAll",
					content: (
						<DataTable
							title="Tickets Sold"
							data={ticketsSold}
							params={params}
							columns={columnsTicketsSold}
							showControlBtns={true}
							type={TableTypes.TICKET_SOLD}
							create_title="Add Ticket"
							create_link="tickets/create"
							subtitle="Manage your tickets and view who buyed them."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "number", label: "Number" },
								{ column: "soldPrice", label: "Sold Price" },
								{ column: "paymentId", label: "Payment Id" },
								{ column: "clientId", label: "Client Id" },
								{ column: "showRoomId", label: "Show Room Id" },
								{ column: "showId", label: "Show Id" },
								{ column: "seatId", label: "Seat Id" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
				{
					name: "All Verified Tickets",
					value: "ticketsVerified",
					content: (
						<DataTable
							params={params}
							data={ticketsVerified}
							showControlBtns={true}
							title="Tickets Verified"
							columns={columnsTicketsVerified}
							type={TableTypes.TICKET_VERIFIED}
							create_title="Add Ticket Verified"
							create_link="tickets/create-verified"
							subtitle="Manage your tickets verified for the shows."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "ticketSoldId", label: "Ticket Sold Id" },
								{ column: "verifiedAt", label: "Verified At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
