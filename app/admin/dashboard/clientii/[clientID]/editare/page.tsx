import { prisma } from "@/lib/prismaClient";
import { User } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import AdminClientEdit from "./PageContent";
import { esteNumeric } from "@/lib/metodeUtile";
import { decripteazaParola } from "@/services/auth/autentificare";

export default async function AdminUserEditPage({ params }: { params: any }) {
	let clientId = params.clientID;
	if (!clientId) return notFound();
	if (!esteNumeric(clientId)) return notFound();
	clientId = parseInt(clientId);
	const client = await prisma.client.findFirst({
		where: {
			codClient: clientId,
		},
	});
	if (!client) {
		return notFound();
	}
	const passClient = {
		...client,
		parola: decripteazaParola(client.parola),
	} as User;
	return <AdminClientEdit client={passClient} params={params} />;
}
