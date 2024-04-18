import { columns } from "./columns";
import { prisma } from "@/lib/prismaClient";
import TableContainer from "@/components/admin/table/TableContainer";
import { Rent, TableTypes } from "@/lib/types";

export default async function AdminRents({ params }: { params: any }) {
	const rents: Rent[] = await prisma.rent.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			car: {
				include: {
					brand: true,
					fuelPolicy: true,
					locationType: true,
					specifications: true,
				},
			},
			user: true,
			payment: true,
			invoice: true,
		},
	});
	return (
		<TableContainer
			params={params}
			showControlBtns={true}
			type={TableTypes.RENTS}
			columns={columns}
			data={rents}
			filters={[
				{
					column: "id",
					label: "ID",
				},
				{
					column: "daysOfRent",
					label: "Days Of Rent",
				},
				{
					column: "dropOffDate",
					label: "Drop Off Date",
				},
				{
					column: "dropOffLocation",
					label: "Drop Off Location",
				},
				{
					column: "pickUpDate",
					label: "Pick Up Date",
				},
				{
					column: "pickUpLocation",
					label: "Pick Up Location",
				},
				{
					column: "userId",
					label: "User Id",
				},
				{
					column: "carId",
					label: "Car Id",
				},
			]}
			new_link="rents/new"
			page_title="All Rents"
		/>
	);
}
