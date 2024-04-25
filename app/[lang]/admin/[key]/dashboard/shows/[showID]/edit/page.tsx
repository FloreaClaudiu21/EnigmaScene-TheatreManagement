import { notFound } from "next/navigation";
import React from "react";
import AdminShowEditPage from "./PageContent";
import { getShowById } from "@/services/admin/ControlProvider";
import { prisma } from "@/lib/prismaClient";
import { Season, ShowRoom, ShowType } from "@/lib/types";
import { isNumeric } from "@/lib/utils";

export default async function AdminShowEdit({ params }: { params: any }) {
	let id = params.showID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const show = await getShowById(id);
	if (!show) return notFound();
	const seasons: Season[] = await prisma.season.findMany({});
	const categories: ShowType[] = await prisma.showType.findMany({});
	const showRooms: ShowRoom[] = await prisma.showRoom.findMany({});
	return (
		<AdminShowEditPage
			params={params}
			show={show}
			categories={categories}
			seasons={seasons}
			showRooms={showRooms}
		/>
	);
}
