import { notFound } from "next/navigation";
import React from "react";
import AdminShowEditPage from "./PageContent";
import { getShowById } from "@/services/admin/ControlProvider";
import { prisma } from "@/lib/prismaClient";
import { isNumeric } from "@/lib/utils";
import { SalaSpectacol, Sezon, TipSpectacol } from "@/lib/types";

export default async function AdminShowEdit({ params }: { params: any }) {
	let id = params.showID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const show = await getShowById(id);
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
