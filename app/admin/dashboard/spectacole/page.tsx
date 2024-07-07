import DataTable from "@/components/admin/table/GeneralTabel";
import { prisma } from "@/lib/prismaClient";
import { columnsShow } from "./columnsShow";
import { columnsSeason } from "./columnsSeason";
import { columnsShowType } from "./columnsShowType";
import { Sezon, Spectacol, TipSpectacol, TipuriTabel } from "@/lib/tipuri";
import PaginiTab from "@/components/admin/table/PaginiTab";

export default async function AdminShows() {
	const seasons: Sezon[] = await prisma.sezon.findMany({});
	const categories: TipSpectacol[] = await prisma.tipSpectacol.findMany({});
	const shows: Spectacol[] = await prisma.spectacol.findMany({
		orderBy: {
			creatPe: "desc",
		},
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
		<PaginiTab
			valoareDef="showsAll"
			taburi={[
				{
					nume: "Toate Spectacolele",
					valoare: "showsAll",
					continut: (
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
								{ column: "numeSezon", label: "Nume Sezon" },
								{ column: "codTipSpectacol", label: "Cod Categorie" },
								{ column: "numeTip", label: "Nume Categorie" },
								{ column: "codSalaSpectacol", label: "Cod Sala" },
								{ column: "numarSala", label: "Numar Sala" },
								{ column: "titlu", label: "Titlu" },
								{ column: "director", label: "Regizor" },
								{ column: "actorii", label: "Actorii" },
								{ column: "oraIncepere", label: "Ora & Data Inceperii" },
								{ column: "oraTerminare", label: "Ora & Data Terminării" },
								{ column: "creatPe", label: "Adăugat Pe" },
							]}
						/>
					),
				},
				{
					nume: "Sezoane",
					valoare: "showsSeasons",
					continut: (
						<DataTable
							data={seasons}
							title="Sezoane Spectacole"
							columns={columnsSeason}
							showControlBtns={true}
							type={TipuriTabel.SEZON_SPECTACOL}
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
					nume: "Categorii",
					valoare: "showsCategory",
					continut: (
						<DataTable
							data={categories}
							showControlBtns={true}
							title="Categorii Spectacole"
							columns={columnsShowType}
							type={TipuriTabel.CATEGORIE_SPECTACOL}
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
