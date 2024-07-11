import DataTable from "@/components/admin/table/GeneralTabel";
import { prisma } from "@/lib/prismaClient";
import { columnsShowRoom } from "./coloane/definireColoaneSalaSpectacol";
import { columnsShowRoomSeat } from "./coloane/definireColoaneScauneSalaSpectacol";
import { LocSalaSpectacol, SalaSpectacol, TipuriTabel } from "@/lib/tipuri";
import PaginiTab from "@/components/admin/table/PaginiTab";

export default async function AdminShowRooms() {
	const showRoomsSeats: LocSalaSpectacol[] = await prisma.locSalaSpectacol.findMany(
		{
			orderBy: {
				creatPe: "desc",
			},
			include: {
				salaSpectacol: true,
			},
		}
	);
	const showRooms: SalaSpectacol[] = await prisma.salaSpectacol.findMany({
		orderBy: {
			creatPe: "desc",
		},
		include: {
			locuriSala: true,
			bileteVandute: true,
		},
	});
	return (
		<PaginiTab
			valoareDef="roomsAll"
			taburi={[
				{
					nume: "Toate sălile",
					valoare: "roomsAll",
					continut: (
						<DataTable
							data={showRooms}
							title="Sălii Spectacol"
							showControlBtns={true}
							columns={columnsShowRoom}
							type={TipuriTabel.CAMERA_SPECTACOL}
							create_link="camereSpectacol/creare"
							subtitle="Administrați sălile de spectacol și vizualizați locurile alocate acestora."
							filters={[
								{ column: "codSalaSpectacol", label: "Cod Sala Spectacol" },
								{ column: "numarSala", label: "Numar Sala" },
							]}
						/>
					),
				},
				{
					nume: "Locuri în sălii",
					valoare: "showsRoomSeats",
					continut: (
						<DataTable
							data={showRoomsSeats}
							title="Locuri Sălii Spectacol"
							showControlBtns={true}
							columns={columnsShowRoomSeat}
							type={TipuriTabel.SCAUN_CAMERA_SPECTACOL}
							create_link="camereSpectacol/creare-loc"
							subtitle="Administrați locurile din sala de spectacole (tip, preț etc)."
							filters={[
								{ column: "codLocSala", label: "Cod Loc Sala" },
								{ column: "codSalaSpectacol", label: "Cod Sala Spectacol" },
								{ column: "numarSala", label: "Numar Sala Spectacol" },
								{ column: "numarLoc", label: "Numar Loc" },
								{ column: "rand", label: "Rand Loc" },
								{ column: "pretLoc", label: "Pret Loc" },
								{ column: "tipLoc", label: "Tip Loc" },
								{ column: "createdAt", label: "Creat Pe" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
