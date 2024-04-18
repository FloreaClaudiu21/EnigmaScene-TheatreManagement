import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import AdminSeasonEdit from "./PageContent";

export default async function AdminShowSeasonEditPage({
	params,
}: {
	params: any;
}) {
	const id = params.showID;
	if (!id) return notFound();
	const found = await prisma.season.findFirst({
		where: {
			id,
		},
	});
	if (!found) {
		return notFound();
	}
	return <AdminSeasonEdit params={params} season={found} />;
}
