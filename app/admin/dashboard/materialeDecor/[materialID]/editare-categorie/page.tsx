import { notFound } from "next/navigation";
import React from "react";
import { getShowMaterialCategoryById } from "@/services/admin/ControlProvider";
import AdminMaterialCategoryEdit from "./PageContent";
import { isNumeric } from "@/lib/utils";

export default async function AdminMaterialCategoryEditPage({
	params,
}: {
	params: any;
}) {
	let id = params.materialID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const found = await getShowMaterialCategoryById(id);
	if (!found) {
		return notFound();
	}
	return <AdminMaterialCategoryEdit category={found} />;
}
