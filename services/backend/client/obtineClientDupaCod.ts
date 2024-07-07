"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineClientDupaCod = async (id: number) => {
	const foundClient = await prisma.client.findFirst({
		where: {
			codClient: id,
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
	return foundClient;
};
