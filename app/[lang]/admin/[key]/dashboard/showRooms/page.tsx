import DataTable from "@/components/admin/table/Table";
import { prisma } from "@/lib/prismaClient";
import { ShowRoom, ShowRoomSeat, TableTypes } from "@/lib/types";
import TabsPages from "@/components/admin/table/TabsPages";
import { columnsShowRoom } from "./columnsShowRoom";
import { columnsShowRoomSeat } from "./columnsShowRoomSeat";

export default async function AdminShowRooms({ params }: { params: any }) {
	const showRoomsSeats: ShowRoomSeat[] = await prisma.showRoomSeat.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			showRoom: true,
		},
	});
	const showRooms: ShowRoom[] = await prisma.showRoom.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			seats: true,
			ticketsSold: true,
		},
	});
	return (
		<TabsPages
			defVal="roomsAll"
			tabs={[
				{
					name: "All Rooms",
					value: "roomsAll",
					content: (
						<DataTable
							params={params}
							data={showRooms}
							title="Show Rooms"
							showControlBtns={true}
							columns={columnsShowRoom}
							type={TableTypes.SHOWROOM}
							create_title="Add Show Room"
							create_link="showRooms/create"
							subtitle="Manage your show rooms and view their allocated seats."
							filters={[{ column: "id", label: "ID" }]}
						/>
					),
				},
				{
					name: "Show Room Seats",
					value: "showsRoomSeats",
					content: (
						<DataTable
							params={params}
							data={showRoomsSeats}
							title="Show Room Seats"
							showControlBtns={true}
							columns={columnsShowRoomSeat}
							type={TableTypes.SHOWROOM_SEAT}
							create_title="Add Show Room Seat"
							create_link="showRooms/create-seat"
							subtitle="Manage your show room seats (type, price etc)"
							filters={[
								{ column: "id", label: "ID" },
								{ column: "price", label: "Price" },
								{ column: "row", label: "Seat Row" },
								{ column: "type", label: "Seat Type" },
								{ column: "showRoomId", label: "Show Room Id" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
