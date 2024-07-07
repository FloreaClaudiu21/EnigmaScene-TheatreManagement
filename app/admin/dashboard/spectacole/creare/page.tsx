import { prisma } from "@/lib/prismaClient";
import { SalaSpectacol, Sezon, TipSpectacol } from "@/lib/tipuri";
import React from "react";
import AdminShowNew from "./PageContent";

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
