import { notFound } from "next/navigation";
import React from "react";
import AdminSeasonEdit from "./PageContent";
import { getSeasonById } from "@/services/admin/ControlProvider";
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
	const found = await getSeasonById(id);
	if (!found) {
		return notFound();
	}
	return <AdminSeasonEdit season={found} />;
}
