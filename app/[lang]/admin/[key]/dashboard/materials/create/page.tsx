import { prisma } from "@/lib/prismaClient";
import { ShowMaterialDecorationCategory } from "@/lib/types";
import React from "react";
import AdminMaterialNew from "./PageContent";

export default async function AdminMaterialDecorationCreate({
	params,
}: {
	params: any;
}) {
	const categories: ShowMaterialDecorationCategory[] = await prisma.showMaterialDecorationCategory.findMany();
	return <AdminMaterialNew categories={categories} params={params} />;
}
