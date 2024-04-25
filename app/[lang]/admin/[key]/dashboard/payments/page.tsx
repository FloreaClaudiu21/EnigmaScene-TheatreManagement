import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { Payment, TableTypes } from "@/lib/types";
import { columnsPayments } from "./columns";

export default async function AdminPayments({ params }: { params: any }) {
	const payments: Payment[] = await prisma.payment.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			client: true,
			ticket: {
				include: {
					show: {
						include: {
							season: true,
							showType: true,
							showRoom: true,
						},
					},
					seat: true,
					invoice: true,
					showRoom: true,
					client: true,
					payment: true,
				},
			},
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
		},
	});
	return (
		<TabsPages
			defVal="all"
			tabs={[
				{
					name: "All Payments",
					value: "all",
					content: (
						<DataTable
							params={params}
							title="Payments"
							data={payments}
							showControlBtns={false}
							columns={columnsPayments}
							type={TableTypes.PAYMENT}
							create_title="Add Payment"
							create_link="payments/create"
							subtitle="Manage your payments and view their status."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "amount", label: "Amount Paid" },
								{ column: "currency", label: "Currency" },
								{ column: "currencyAmount", label: "Currency Amount" },
								{ column: "currencyDate", label: "Currency Date" },
								{ column: "type", label: "Payment Method" },
								{ column: "paidAt", label: "Payment Date" },
								{ column: "status", label: "Payment Status" },
								{ column: "clientId", label: "Client Id" },
								{ column: "ticketId", label: "Ticket Id" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
