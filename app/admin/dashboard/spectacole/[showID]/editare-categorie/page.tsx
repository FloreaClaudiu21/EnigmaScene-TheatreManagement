import { notFound } from "next/navigation";
import React from "react";
import AdminCategoryEdit from "./PageContent";
import { getCategoryById } from "@/services/admin/ControlProvider";
import { isNumeric } from "@/lib/utils";

export default async function AdminShowSeasonEditPage({
	params,
}: {
	params: any;
}) {
	let id = params.showID;
	if (!id) return notFound();
	if (!isNumeric(id)) return notFound();
	id = parseInt(id);
	const found = await getCategoryById(id);
	if (!found) {
		return notFound();
	}
	return <AdminCategoryEdit category={found} />;
}
