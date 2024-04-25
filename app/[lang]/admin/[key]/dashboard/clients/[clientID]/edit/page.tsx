import { prisma } from "@/lib/prismaClient";
import { decryptPassword } from "@/services/general/AuthProvider";
import { User } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import AdminClientEdit from "./PageContent";
import { isNumeric } from "@/lib/utils";

export default async function AdminUserEditPage({ params }: { params: any }) {
	let clientId = params.clientID;
	if (!clientId) return notFound();
	if (!isNumeric(clientId)) return notFound();
	clientId = parseInt(clientId);
	const client = await prisma.client.findFirst({
		where: {
			id: clientId,
		},
	});
	if (!client) {
		return notFound();
	}
	const passClient = {
		...client,
		password: decryptPassword(client.password),
	} as User;
	return <AdminClientEdit client={passClient} params={params} />;
}
