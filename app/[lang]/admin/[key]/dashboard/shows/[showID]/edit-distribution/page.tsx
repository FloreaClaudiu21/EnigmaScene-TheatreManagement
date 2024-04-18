import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import AdminDistributionEdit from "./PageContent";

export default async function AdminShowDistributionEditPage({
	params,
}: {
	params: any;
}) {
	const id = params.showID;
	if (!id) return notFound();
	const found = await prisma.distribution.findFirst({
		where: {
			id,
		},
	});
	if (!found) {
		return notFound();
	}
	return <AdminDistributionEdit distribution={found} params={params} />;
}
