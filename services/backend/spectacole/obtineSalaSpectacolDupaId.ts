"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineSalaSpectacolDupaId = async (id: number) => {
	const client = await prisma.salaSpectacol.findFirst({
		where: {
			codSalaSpectacol: id,
		},
		include: {
			spectacole: true,
			bileteVandute: true,
			locuriSala: true,
		},
	});
	return client;
};
