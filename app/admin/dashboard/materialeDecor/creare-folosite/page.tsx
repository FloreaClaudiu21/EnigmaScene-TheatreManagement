import { prisma } from "@/lib/prismaClient";
import React from "react";
import AdminMaterialUsedNew from "./PageContent";
import { MaterialDecorSpectacol, Spectacol } from "@/lib/types";

export default async function AdminMaterialDecorationUsedCreate() {
	const shows: Spectacol[] = await prisma.spectacol.findMany({
		include: {
			tipSpectacol: true,
			salaSpectacol: true,
			sezon: true,
		},
	});
	const materials: MaterialDecorSpectacol[] = await prisma.materialDecorSpectacol.findMany(
		{
			include: {
				categorieMaterialDecor: true,
			},
		}
	);
	const foundMaterials = materials.filter((m) => m.cantitateStoc > 0);
	return <AdminMaterialUsedNew materials={foundMaterials} shows={shows} />;
}
