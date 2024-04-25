import { prisma } from "@/lib/prismaClient";
import { Show, ShowMaterialDecoration } from "@/lib/types";
import React from "react";
import AdminMaterialUsedNew from "./PageContent";

export default async function AdminMaterialDecorationUsedCreate({
	params,
}: {
	params: any;
}) {
	const shows: Show[] = await prisma.show.findMany({
		include: {
			showType: true,
			season: true,
			showRoom: true,
		},
	});
	const materials: ShowMaterialDecoration[] = await prisma.showMaterialDecoration.findMany(
		{
			include: {
				category: true,
			},
		}
	);
	const foundMaterials = materials.filter((m) => m.stock > 0);
	return (
		<AdminMaterialUsedNew
			params={params}
			materials={foundMaterials}
			shows={shows}
		/>
	);
}
