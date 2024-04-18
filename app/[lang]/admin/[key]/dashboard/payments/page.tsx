import { columns } from "./columns";
import { prisma } from "@/lib/prismaClient";
import TableContainer from "@/components/admin/table/TableContainer";
import { Payment, TableTypes } from "@/lib/types";

export default async function AdminPayments({ params }: { params: any }) {
	const payments: Payment[] = await prisma.payment.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			invoice: true,
			rent: true,
			user: true,
		},
	});
	return (
		<TableContainer
			params={params}
			showControlBtns={false}
			type={TableTypes.PAYMENTS}
			columns={columns}
			data={payments}
			filters={[
				{
					column: "id",
					label: "ID",
				},
				{
					column: "amount",
					label: "Amount",
				},
				{
					column: "currency",
					label: "Currency",
				},
				{
					column: "paidAt",
					label: "Paid At",
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
			new_link="payments/new"
			page_title="All Payments"
		/>
	);
}
