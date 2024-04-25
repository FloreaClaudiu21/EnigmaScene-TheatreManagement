import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import {
	ShowMaterialDecoration,
	ShowMaterialDecorationCategory,
	ShowMaterialDecorationUsed,
	TableTypes,
} from "@/lib/types";
import { columnsMaterials } from "./columnsMaterials";
import { columnsMaterialsCategory } from "./columnsMaterialsType";
import { columnsMaterialsUsed } from "./columnsMaterialsUsed";

export default async function AdminDecorationMaterials({
	params,
}: {
	params: any;
}) {
	const materialsCategory: ShowMaterialDecorationCategory[] = await prisma.showMaterialDecorationCategory.findMany();
	const materials: ShowMaterialDecoration[] = await prisma.showMaterialDecoration.findMany(
		{
			include: {
				category: true,
			},
		}
	);
	const materialsUsed: ShowMaterialDecorationUsed[] = await prisma.showMaterialDecorationUsed.findMany(
		{
			include: {
				material: {
					include: {
						category: true,
					},
				},
				show: {
					include: {
						season: true,
						showType: true,
					},
				},
			},
		}
	);
	return (
		<TabsPages
			defVal="allMaterials"
			tabs={[
				{
					name: "All Materials",
					value: "allMaterials",
					content: (
						<DataTable
							params={params}
							data={materials}
							title="Decoration Materials"
							showControlBtns={true}
							columns={columnsMaterials}
							type={TableTypes.MATERIAL}
							create_title="Add Decoration Material"
							create_link="materials/create"
							subtitle="Manage your decoration materials and view their category."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "name", label: "Material Name" },
								{ column: "name_en", label: "Material Name EN" },
								{ column: "stock", label: "Stock" },
								{ column: "producer", label: "Producer" },
								{ column: "buyDate", label: "Buy Date" },
								{ column: "buyPrice", label: "Buy Price" },
								{ column: "categoryId", label: "Category Id" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
				{
					name: "Materials Used",
					value: "allMaterialsUsed",
					content: (
						<DataTable
							params={params}
							data={materialsUsed}
							showControlBtns={true}
							title="Decoration Materials Used"
							columns={columnsMaterialsUsed}
							type={TableTypes.MATERIAL_USED}
							create_link="materials/create-used"
							create_title="Add Material Used"
							subtitle="Manage your decoration materials used and view their quantity left."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "showId", label: "Show Id" },
								{ column: "materialId", label: "Material Id" },
								{ column: "quantity", label: "Quantity Used" },
								{ column: "leftQuantity", label: "Quantity Left" },
								{ column: "usedDate", label: "Used Date" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
				{
					name: "Materials Categories",
					value: "materialsCategory",
					content: (
						<DataTable
							data={materialsCategory}
							params={params}
							showControlBtns={true}
							title="Decoration Materials Category"
							columns={columnsMaterialsCategory}
							type={TableTypes.MATERIAL_CATEGORY}
							create_title="Add Material Category"
							create_link="materials/create-category"
							subtitle="Manage your decoration materials categories."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "name", label: "Name" },
								{ column: "name_en", label: "Name EN" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
