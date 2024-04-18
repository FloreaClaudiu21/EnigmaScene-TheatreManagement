import { columns } from "./columns";
import { prisma } from "@/lib/prismaClient";
import TableContainer from "@/components/admin/table/TableContainer";
import { CarBrand, TableTypes } from "@/lib/types";

export default async function AdminCarBrands({ params }: { params: any }) {
	const brands: CarBrand[] = await prisma.carBrand.findMany();
	return (
		<TableContainer
			params={params}
			showControlBtns={true}
			type={TableTypes.BRANDS}
			columns={columns}
			data={brands}
			filters={[
				{
					column: "id",
					label: "ID",
				},
				{
					column: "manufacturer",
					label: "Manufacturer",
				},
				{
					column: "model",
					label: "Model",
				},
				{
					column: "category",
					label: "Category",
				},
				{
					column: "engineType",
					label: "Engine Type",
				},
				{
					column: "fuelType",
					label: "Fuel Type",
				},
				{
					column: "transmissionType",
					label: "Transmission Type",
				},
			]}
			new_link="carBrands/new"
			page_title="All Car Brands"
		/>
	);
}
