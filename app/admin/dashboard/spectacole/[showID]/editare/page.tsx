import { notFound } from "next/navigation";
import React from "react";
import AdminShowEditPage from "./PageContent";
import { prisma } from "@/lib/prismaClient";
import { obtineSpectacolDupaId } from "@/services/backend/spectacole/obtineSpectacolDupaId";
import { esteNumeric } from "@/lib/metodeUtile";
import { SalaSpectacol, Sezon, TipSpectacol } from "@/lib/tipuri";

export default async function AdminShowEdit({ params }: { params: any }) {
	let id = params.showID;
	if (!id) return notFound();
	if (!esteNumeric(id)) return notFound();
	id = parseInt(id);
	const show = await obtineSpectacolDupaId(id);
	if (!show) return notFound();
	const seasons: Sezon[] = await prisma.sezon.findMany({});
	const categories: TipSpectacol[] = await prisma.tipSpectacol.findMany({});
	const showRooms: SalaSpectacol[] = await prisma.salaSpectacol.findMany({});
	return (
		<AdminShowEditPage
			show={show}
			categories={categories}
			seasons={seasons}
			showRooms={showRooms}
		/>
	);
}
