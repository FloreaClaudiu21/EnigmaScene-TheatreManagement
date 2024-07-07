import { notFound } from "next/navigation";
import React from "react";
import AdminCategoryEdit from "./PageContent";
import { esteNumeric } from "@/lib/metodeUtile";
import { obtineCategorieSpectacolDupaId } from "@/services/backend/spectacole/obtineSpectacolCategorieDupaId";

export default async function AdminShowSeasonEditPage({
	params,
}: {
	params: any;
}) {
	let id = params.showID;
	if (!id) return notFound();
	if (!esteNumeric(id)) return notFound();
	id = parseInt(id);
	const found = await obtineCategorieSpectacolDupaId(id);
	if (!found) {
		return notFound();
	}
	return <AdminCategoryEdit category={found} />;
}
