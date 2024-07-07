"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineCategorieSpectacolDupaId = async (id: number) => {
	const client = await prisma.tipSpectacol.findFirst({
		where: {
			codTipSpectacol: id,
		},
		include: {
			spectacole: true,
		},
	});
	return client;
};
