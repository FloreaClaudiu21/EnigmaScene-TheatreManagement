import DataTable from "@/components/admin/table/Table";
import { prisma } from "@/lib/prismaClient";
import TabsPages from "@/components/admin/table/TabsPages";
import { columnsShow } from "./columnsShow";
import { columnsSeason } from "./columnsSeason";
import { columnsShowType } from "./columnsShowType";
import { Sezon, Spectacol, TipSpectacol, TipuriTabel } from "@/lib/types";

export default async function AdminShows() {
	const seasons: Sezon[] = await prisma.sezon.findMany({});
	const categories: TipSpectacol[] = await prisma.tipSpectacol.findMany({});
	const shows: Spectacol[] = await prisma.spectacol.findMany({
		include: {
			bileteVandute: true,
			bonuriFiscale: true,
			sezon: true,
			tipSpectacol: true,
			salaSpectacol: {
				include: {
					locuriSala: true,
				},
			},
		},
	});
	return (
		<TabsPages
			defVal="showsAll"
			tabs={[
				{
					name: "Toate Spectacolele",
					value: "showsAll",
					content: (
						<DataTable
							title="Spectacole Disponibile"
							data={shows}
							columns={columnsShow}
							showControlBtns={true}
							type={TipuriTabel.SPECTACOL}
							create_link="spectacole/creare"
							subtitle="Administrați spectacolele și vizualizați materialele de decor utilizate."
							filters={[
								{ column: "codSpectacol", label: "Cod Spectacol" },
								{ column: "codSezon", label: "Cod Sezon" },
								{ column: "codTipSpectacol", label: "Cod Categorie" },
								{ column: "codSalaSpectacol", label: "Cod Sala Spectacol" },
								{ column: "titlu", label: "Titlu" },
								{ column: "actorii", label: "Actorii" },
								{ column: "oraIncepere", label: "Ora & Data Inceperii" },
								{ column: "oraTerminare", label: "Ora & Data Terminării" },
								{ column: "creatPe", label: "Adăugat Pe" },
							]}
						/>
					),
				},
				{
					name: "Sezoane",
					value: "showsSeasons",
					content: (
						<DataTable
							data={seasons}
							title="Sezoane Spectacole"
							columns={columnsSeason}
							showControlBtns={true}
							type={TipuriTabel.SPECTACOL_SEZON}
							create_link="spectacole/creare-sezon"
							subtitle="Administrați sezoanele spectacolelor."
							filters={[
								{ column: "codSezon", label: "Cod Sezon" },
								{ column: "numeSezon", label: "Nume Sezon" },
								{ column: "creatPe", label: "Creat Pe" },
							]}
						/>
					),
				},
				{
					name: "Categorii",
					value: "showsCategory",
					content: (
						<DataTable
							data={categories}
							showControlBtns={true}
							title="Categorii Spectacole"
							columns={columnsShowType}
							type={TipuriTabel.SPECTACOL_CATEGORIE}
							create_link="spectacole/creare-categorie"
							subtitle="Administrați categoriile spectacolelor."
							filters={[
								{ column: "codTipSpectacol", label: "Cod Categorie Spectacol" },
								{ column: "numeTip", label: "Nume Categorie" },
								{ column: "creatPe", label: "Creat Pe" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
