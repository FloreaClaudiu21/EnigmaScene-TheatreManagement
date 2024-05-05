import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import { getShowMaterialById } from "@/services/admin/ControlProvider";
import { CategorieMaterialDecor } from "@/lib/types";
import AdminMaterialDecorationEdit from "./PageContent";
import { isNumeric } from "@/lib/utils";

export default async function AdminMaterialEditPage({
	params,
}: {
	params: any;
}) {
	let id = params.materialID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const material = await getShowMaterialById(id);
	if (!material) return notFound();
	const categories: CategorieMaterialDecor[] = await prisma.categorieMaterialDecor.findMany(
		{}
	);
	return (
		<AdminMaterialDecorationEdit categories={categories} material={material} />
	);
}
