import DataTable from "@/components/admin/table/Table";
import { prisma } from "@/lib/prismaClient";
import { LocSalaSpectacol, SalaSpectacol, TipuriTabel } from "@/lib/types";
import TabsPages from "@/components/admin/table/TabsPages";
import { columnsShowRoom } from "./columnsShowRoom";
import { columnsShowRoomSeat } from "./columnsShowRoomSeat";

export default async function AdminShowRooms() {
	const showRoomsSeats: LocSalaSpectacol[] = await prisma.locSalaSpectacol.findMany(
		{
			include: {
				salaSpectacol: true,
			},
		}
	);
	const showRooms: SalaSpectacol[] = await prisma.salaSpectacol.findMany({
		include: {
			locuriSala: true,
			bileteVandute: true,
		},
	});
	return (
		<TabsPages
			defVal="roomsAll"
			tabs={[
				{
					name: "Toate sălile",
					value: "roomsAll",
					content: (
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
							]}
						/>
					),
				},
				{
					name: "Locuri în sălii",
					value: "showsRoomSeats",
					content: (
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
