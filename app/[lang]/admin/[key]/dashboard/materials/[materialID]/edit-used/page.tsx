import { notFound } from "next/navigation";
import React from "react";
import { getShowMaterialUsedById } from "@/services/admin/ControlProvider";
import AdminMaterialUsedEdit from "./PageContent";
import { isNumeric } from "@/lib/utils";

export default async function AdminMaterialUsedEditPage({
	params,
}: {
	params: any;
}) {
	let id = params.materialID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const found = await getShowMaterialUsedById(id);
	if (!found) {
		return notFound();
	}
	return <AdminMaterialUsedEdit params={params} material={found} />;
}
