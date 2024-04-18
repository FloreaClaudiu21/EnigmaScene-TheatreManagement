import { columns } from "./columns";
import { prisma } from "@/lib/prismaClient";
import TableContainer from "@/components/admin/table/TableContainer";
import { Invoice, TableTypes } from "@/lib/types";

export default async function AdminPayments({ params }: { params: any }) {
	const invoices: Invoice[] = await prisma.invoice.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			rent: true,
			user: true,
			payment: true,
		},
	});
	return (
		<TableContainer
			params={params}
			showControlBtns={false}
			type={TableTypes.INVOICES}
			columns={columns}
			data={invoices}
			filters={[
				{
					column: "id",
					label: "ID",
				},
				{
					column: "email",
					label: "Email",
				},
				{
					column: "invoiceNumber",
					label: "Invoice Number",
				},
				{
					column: "totalAmount",
					label: "Total Amount",
				},
				{
					column: "currency",
					label: "Currency",
				},
				{
					column: "status",
					label: "Status",
				},
				{
					column: "userId",
					label: "User Id",
				},
			]}
			new_link="invoices/new"
			page_title="All Invoices"
		/>
	);
}
