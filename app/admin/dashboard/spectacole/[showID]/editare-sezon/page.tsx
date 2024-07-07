import { notFound } from "next/navigation";
import React from "react";
import AdminSeasonEdit from "./PageContent";
import { obtineSezonSpectacolDupaId } from "@/services/backend/spectacole/obtineSezonSpectacolDupaId";
import { esteNumeric } from "@/lib/metodeUtile";

export default async function AdminShowSeasonEditPage({
	params,
}: {
	params: any;
}) {
	let id = params.showID;
	if (!id) return notFound();
	if (!esteNumeric(id)) return notFound();
	id = parseInt(id);
	const found = await obtineSezonSpectacolDupaId(id);
	if (!found) {
		return notFound();
	}
	return <AdminSeasonEdit season={found} />;
}
