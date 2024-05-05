import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminShowNew from "./PageContent";
import { SalaSpectacol, Sezon, TipSpectacol } from "@/lib/types";

export default async function PageCreateShow() {
	const seasons: Sezon[] = await prisma.sezon.findMany({});
	const categories: TipSpectacol[] = await prisma.tipSpectacol.findMany({});
	const showRooms: SalaSpectacol[] = await prisma.salaSpectacol.findMany({});
	return (
		<AdminShowNew
			categories={categories}
			seasons={seasons}
			showRooms={showRooms}
		/>
	);
}
