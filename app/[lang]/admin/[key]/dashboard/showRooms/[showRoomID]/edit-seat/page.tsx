import { notFound } from "next/navigation";
import React from "react";
import { getShowRoomSeatById } from "@/services/admin/ControlProvider";
import AdminShowRoomSeatEdit from "./PageContent";
import { ShowRoom } from "@/lib/types";
import { prisma } from "@/lib/prismaClient";
import { isNumeric } from "@/lib/utils";

export default async function AdminShowRoomSeatPageEdit({
	params,
}: {
	params: any;
}) {
	let id = params.showRoomID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const showRoomSeat = await getShowRoomSeatById(id);
	if (!showRoomSeat) return notFound();
	const rooms: ShowRoom[] = await prisma.showRoom.findMany({
		include: {
			seats: true,
		},
	});
	return (
		<AdminShowRoomSeatEdit
			params={params}
			showRooms={rooms}
			showRoomSeat={showRoomSeat}
		/>
	);
}
