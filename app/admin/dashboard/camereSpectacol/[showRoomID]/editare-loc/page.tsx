import { notFound } from "next/navigation";
import React from "react";
import AdminShowRoomSeatEdit from "./PageContent";
import { prisma } from "@/lib/prismaClient";
import { obtineLocSalaSpectacolDupaId } from "@/services/backend/spectacole/obtineLocSalaSpectacolDupaId";
import { esteNumeric } from "@/lib/metodeUtile";
import { SalaSpectacol } from "@/lib/tipuri";

export default async function AdminShowRoomSeatPageEdit({
	params,
}: {
	params: any;
}) {
	let id = params.showRoomID;
	if (!id) return notFound();
	if (!esteNumeric(id)) return notFound();
	id = parseInt(id);
	const showRoomSeat = await obtineLocSalaSpectacolDupaId(id);
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
