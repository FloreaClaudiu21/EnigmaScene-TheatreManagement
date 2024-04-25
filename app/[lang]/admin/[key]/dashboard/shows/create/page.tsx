import { prisma } from "@/lib/prismaClient";
import { Season, ShowRoom, ShowType } from "@/lib/types";
import React from "react";
import AdminShowNew from "./PageContent";

export default async function PageCreateShow({ params }: { params: any }) {
	const seasons: Season[] = await prisma.season.findMany({});
	const categories: ShowType[] = await prisma.showType.findMany({});
	const showRooms: ShowRoom[] = await prisma.showRoom.findMany({});
	return (
		<AdminShowNew
			params={params}
			categories={categories}
			seasons={seasons}
			showRooms={showRooms}
		/>
	);
}
