import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import AdminCategoryEdit from "./PageContent";

export default async function AdminShowSeasonEditPage({
	params,
}: {
	params: any;
}) {
	const id = params.showID;
	if (!id) return notFound();
	const found = await prisma.showType.findFirst({
		where: {
			id,
		},
	});
	if (!found) {
		return notFound();
	}
	return <AdminCategoryEdit params={params} category={found} />;
}
