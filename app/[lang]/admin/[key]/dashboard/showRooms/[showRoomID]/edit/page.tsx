import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";
import React from "react";
import AdminCarBrandEdit from "./PageContent";

export default async function AdminUserEditPage({ params }: { params: any }) {
	const id = params.carBrandID;
	if (!id) return notFound();
	const brand = await prisma.carBrand.findFirst({
		where: {
			id,
		},
	});
	if (!brand) {
		return notFound();
	}
	return <AdminCarBrandEdit brand={brand} params={params} />;
}
