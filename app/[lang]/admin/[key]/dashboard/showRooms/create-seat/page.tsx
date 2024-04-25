import { prisma } from "@/lib/prismaClient";
import { ShowRoom } from "@/lib/types";
import React from "react";
import AdminShowRoomSeatCreate from "./PageContent";

export default async function AdminRoomCreateSeat({ params }: { params: any }) {
	const rooms: ShowRoom[] = await prisma.showRoom.findMany({
		include: {
			seats: true,
		},
	});
	return <AdminShowRoomSeatCreate params={params} showRooms={rooms} />;
}
