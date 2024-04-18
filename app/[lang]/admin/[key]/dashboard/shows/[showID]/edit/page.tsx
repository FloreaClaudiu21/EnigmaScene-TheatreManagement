import { notFound } from "next/navigation";
import React from "react";
import AdminShowEditPage from "./PageContent";
import { getShowById } from "@/services/admin/ShowsProvider";

export default async function AdminShowEdit({ params }: { params: any }) {
	const id = params.showID;
	if (!id) return notFound();
	const show = await getShowById(id);
	if (!show) {
		return notFound();
	}
	return <AdminShowEditPage params={params} show={show} />;
}
