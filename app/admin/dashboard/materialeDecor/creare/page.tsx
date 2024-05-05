import { prisma } from "@/lib/prismaClient";
import { CategorieMaterialDecor } from "@/lib/types";
import React from "react";
import AdminMaterialNew from "./PageContent";

export default async function AdminMaterialDecorationCreate() {
	const categories: CategorieMaterialDecor[] = await prisma.categorieMaterialDecor.findMany();
	return <AdminMaterialNew categories={categories} />;
}
