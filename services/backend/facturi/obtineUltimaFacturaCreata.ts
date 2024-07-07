"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineUltimaFacturaCreata = async () => {
	return await prisma.facturaFiscala.findFirst({
		orderBy: {
			codFactura: "desc",
		},
		take: 1,
	});
};
