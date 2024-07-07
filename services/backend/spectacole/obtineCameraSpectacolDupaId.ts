"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineSalaSpectacolDupaId = async (id: number) => {
	return await prisma.salaSpectacol.findFirst({
		where: {
			codSalaSpectacol: id,
		},
	});
};
