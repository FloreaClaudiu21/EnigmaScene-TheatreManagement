"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineSpectacolDupaId = async (id: number) => {
	return await prisma.spectacol.findFirst({
		where: {
			codSpectacol: id,
		},
		include: {
			salaSpectacol: true,
			bileteVandute: true,
			sezon: true,
			bonuriFiscale: true,
			tipSpectacol: true,
		},
	});
};
