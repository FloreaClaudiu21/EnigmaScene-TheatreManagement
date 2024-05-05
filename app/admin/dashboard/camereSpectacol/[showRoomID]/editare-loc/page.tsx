import { notFound } from "next/navigation";
import React from "react";
import { getShowRoomSeatById } from "@/services/admin/ControlProvider";
import AdminShowRoomSeatEdit from "./PageContent";
import { SalaSpectacol } from "@/lib/types";
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
	const rooms: SalaSpectacol[] = await prisma.salaSpectacol.findMany({
		include: {
			locuriSala: true,
		},
	});
	return (
		<AdminShowRoomSeatEdit showRooms={rooms} showRoomSeat={showRoomSeat} />
	);
}
