"use server";
import { prisma } from "@/lib/prismaClient";

export const obtineSezonSpectacolDupaId = async (id: number) => {
	const client = await prisma.sezon.findFirst({
		where: {
			codSezon: id,
		},
		include: {
			spectacole: true,
		},
	});
	return client;
};
