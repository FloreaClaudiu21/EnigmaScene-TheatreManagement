import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { columnsMaterials } from "./columnsMaterials";
import { columnsMaterialsCategory } from "./columnsMaterialsType";
import { columnsMaterialsUsed } from "./columnsMaterialsUsed";
import {
	CategorieMaterialDecor,
	MaterialDecorSpectacol,
	MaterialDecorSpectacolFolosit,
	TipuriTabel,
} from "@/lib/types";

export default async function AdminDecorationMaterials() {
	const materialsCategory: CategorieMaterialDecor[] = await prisma.categorieMaterialDecor.findMany();
	const materials: MaterialDecorSpectacol[] = await prisma.materialDecorSpectacol.findMany(
		{
			include: {
				categorieMaterialDecor: true,
			},
		}
	);
	const materialsUsed: MaterialDecorSpectacolFolosit[] = await prisma.materialDecorSpectacolFolosit.findMany(
		{
			include: {
				materialDecorSpectacol: {
					include: {
						categorieMaterialDecor: true,
					},
				},
				spectacol: {
					include: {
						sezon: true,
						tipSpectacol: true,
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
					name: "Toate Materialele",
					value: "allMaterials",
					content: (
						<DataTable
							data={materials}
							title="Materiale de Decor"
							showControlBtns={true}
							columns={columnsMaterials}
							type={TipuriTabel.MATERIAL_DECOR}
							create_link="materialeDecor/creare"
							subtitle="Administrați materialele de decor folosite la spectacole și vizualizați categoria acestora."
							filters={[
								{ column: "codMaterialDecor", label: "Cod Material Decor" },
								{ column: "codCategorieMaterialDecor", label: "Cod Categorie" },
								{ column: "numeMaterial", label: "Nume Material" },
								{ column: "cantitateStoc", label: "Stoc Curent" },
								{ column: "producator", label: "Producător" },
								{ column: "dataAchizitie", label: "Data Achiziție" },
								{ column: "creatPe", label: "Adăugat Pe" },
							]}
						/>
					),
				},
				{
					name: "Materiale Decor Folosite",
					value: "allMaterialsUsed",
					content: (
						<DataTable
							data={materialsUsed}
							showControlBtns={true}
							columns={columnsMaterialsUsed}
							title="Materiale de Decor Folosite"
							type={TipuriTabel.MATERIAL_DECOR_FOLOSIT}
							create_link="materialeDecor/creare-folosite"
							subtitle="Administrați materialele de decor folosite și vizualizați cantitatea rămasă."
							filters={[
								{
									column: "codMaterialDecorSpectacolFolosit",
									label: "Cod Material Decor Folosit",
								},
								{ column: "codSpectacol", label: "Cod Spectacol" },
								{ column: "numeSpectacol", label: "Nume Spectacol" },
								{
									column: "codMaterialDecorSpectacol",
									label: "Cod Material Decor",
								},
								{ column: "cantitateaFolosita", label: "Cantitatea Folosită" },
								{
									column: "cantitateaRamasaPeStoc",
									label: "Cantitatea Rămasă",
								},
								{ column: "dataFolosirii", label: "Data Folosirii" },
								{ column: "creatPe", label: "Adăugat Pe" },
							]}
						/>
					),
				},
				{
					name: "Categorii Materiale Decor",
					value: "materialsCategory",
					content: (
						<DataTable
							data={materialsCategory}
							showControlBtns={true}
							title="Categorii Materiale de Decor"
							columns={columnsMaterialsCategory}
							type={TipuriTabel.MATERIAL_DECOR_CATEGORIE}
							create_link="materialeDecor/creare-categorie"
							subtitle="Administrați categoriile de materiale de decor."
							filters={[
								{ column: "codCategorieMaterialDecor", label: "Cod Categorie" },
								{ column: "numeCategorie", label: "Nume Categorie" },
								{ column: "creatPe", label: "Creat Pe" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
