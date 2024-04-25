import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { FiscalReceipt, TableTypes } from "@/lib/types";
import { columnsReceipts } from "./columns";

export default async function AdminFiscalReceipts({ params }: { params: any }) {
	const receips: FiscalReceipt[] = await prisma.fiscalReceipt.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			payment: {
				include: {
					invoice: true,
				},
			},
			client: true,
			ticket: {
				include: {
					show: {
						include: {
							season: true,
							showType: true,
						},
					},
					client: true,
					seat: true,
					payment: true,
					showRoom: true,
					invoice: true,
				},
			},
			show: {
				include: {
					showType: true,
					season: true,
				},
			},
			invoice: {
				include: {
					ticket: {
						include: {
							show: {
								include: {
									season: true,
									showType: true,
									showRoom: true,
								},
							},
							showRoom: true,
							seat: true,
							client: true,
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
					name: "All Fiscal Receipts",
					value: "all",
					content: (
						<DataTable
							data={receips}
							params={params}
							title="Fiscal Receipts"
							showControlBtns={false}
							columns={columnsReceipts}
							type={TableTypes.FISCAL_RECEIPT}
							create_title="Add Fiscal Receipt"
							create_link="fiscalReceipt/create"
							subtitle="Manage your fiscal receipts and view their client data."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "amount", label: "Amount Paid" },
								{ column: "currency", label: "Currency" },
								{ column: "currencyAmount", label: "Currency Amount" },
								{ column: "currencyDate", label: "Currency Date" },
								{ column: "paidAt", label: "Payment Date" },
								{ column: "ticketId", label: "Ticket Id" },
								{ column: "clientId", label: "Client Id" },
								{ column: "showId", label: "Show Id" },
								{ column: "paymentId", label: "Payment Id" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
