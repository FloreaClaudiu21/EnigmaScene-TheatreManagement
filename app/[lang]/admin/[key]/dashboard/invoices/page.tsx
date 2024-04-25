import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { Invoice, TableTypes } from "@/lib/types";
import { columnsInvoice } from "./columns";

export default async function AdminInvoices({ params }: { params: any }) {
	const invoices: Invoice[] = await prisma.invoice.findMany({
		include: {
			client: true,
			payment: true,
			ticket: {
				include: {
					show: {
						include: {
							season: true,
							showType: true,
							showRoom: true,
						},
					},
					client: true,
					seat: true,
					payment: true,
					showRoom: true,
					invoice: true,
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
		},
	});
	return (
		<TabsPages
			defVal="all"
			tabs={[
				{
					name: "All Invoices",
					value: "all",
					content: (
						<DataTable
							data={invoices}
							params={params}
							title="Invoices"
							showControlBtns={true}
							columns={columnsInvoice}
							type={TableTypes.INVOICE}
							create_title="Add Invoice"
							create_link="invoices/create"
							subtitle="Manage your invoices and view their payment data."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "invoiceNumber", label: "Invoice Number" },
								{ column: "paymentId", label: "Payment Id" },
								{ column: "fiscalReceiptId", label: "Fiscal Receipt Id" },
								{ column: "extraFees", label: "Extra Fees" },
								{ column: "totalAmount", label: "Total Amount (RON)" },
								{ column: "currency", label: "Currency" },
								{ column: "currencyAmount", label: "Currency Amount" },
								{ column: "currencyDate", label: "Currency Date" },
								{ column: "issueDate", label: "Issue Date" },
								{ column: "ticketId", label: "Ticket Id" },
								{ column: "clientId", label: "Client Id" },
								{ column: "billingAddress", label: "Billing Address" },
								{ column: "email", label: "Email" },
								{ column: "firstName", label: "First Name" },
								{ column: "lastName", label: "Last Name" },
								{ column: "phone", label: "Phone" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
