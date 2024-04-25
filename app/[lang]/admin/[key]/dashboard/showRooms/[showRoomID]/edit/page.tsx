import { notFound } from "next/navigation";
import React from "react";
import AdminShowRoomEdit from "./PageContent";
import { getShowRoomById } from "@/services/admin/ControlProvider";
import { isNumeric } from "@/lib/utils";

export default async function AdminShowRoomPageEdit({
	params,
}: {
	params: any;
}) {
	let id = params.showRoomID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const showRoom = await getShowRoomById(id);
	if (!showRoom) return notFound();
	return <AdminShowRoomEdit params={params} showRoom={showRoom} />;
}
