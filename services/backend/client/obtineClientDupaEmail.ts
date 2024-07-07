"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineClientDupaEmail = async (email: string) => {
	const client = await prisma.client.findFirst({
		where: {
			email,
		},
		include: {
			providerii: true,
			adreseFacturare: true,
			bileteCumparate: true,
			bonuriFiscale: true,
			facturiiEmise: true,
			platiiEfectuate: true,
		},
	});
	return client;
};
