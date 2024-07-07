import { notFound } from "next/navigation";
import React from "react";
import AdminShowRoomEdit from "./PageContent";
import { obtineSalaSpectacolDupaId } from "@/services/backend/spectacole/obtineSalaSpectacolDupaId";
import { esteNumeric } from "@/lib/metodeUtile";

export default async function AdminShowRoomPageEdit({
	params,
}: {
	params: any;
}) {
	let id = params.showRoomID;
	if (!id) return notFound();
	if (!esteNumeric(id)) return notFound();
	id = parseInt(id);
	const showRoom = await obtineSalaSpectacolDupaId(id);
	if (!showRoom) return notFound();
	return <AdminShowRoomEdit showRoom={showRoom} />;
}
