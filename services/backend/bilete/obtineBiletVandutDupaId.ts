"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineBiletVandutDupaId = (id: number) => {
	return prisma.biletSpectacol.findFirst({
		where: {
			codBiletSpectacol: id,
		},
		include: {
			salaSpectacol: true,
			spectacol: true,
			client: true,
			locSalaSpectacol: true,
			bonFiscal: true,
			factura: true,
		},
	});
};
