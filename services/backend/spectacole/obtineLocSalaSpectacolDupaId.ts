"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineLocSalaSpectacolDupaId = async (id: number) => {
	const client = await prisma.locSalaSpectacol.findFirst({
		where: {
			codLocSala: id,
		},
		include: {
			bileteVandute: true,
			salaSpectacol: true,
		},
	});
	return client;
};
