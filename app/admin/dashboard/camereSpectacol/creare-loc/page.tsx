import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminShowRoomSeatCreate from "./PageContent";
import { SalaSpectacol } from "@/lib/tipuri";

export default async function AdminRoomCreateSeat() {
	const rooms: SalaSpectacol[] = await prisma.salaSpectacol.findMany({
		include: {
			locuriSala: true,
		},
	});
	return <AdminShowRoomSeatCreate showRooms={rooms} />;
}
