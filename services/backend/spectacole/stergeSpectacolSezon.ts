"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";

export const stergeSpectacolSezon = async (id: number) => {
	await prisma.sezon.delete({
		where: {
			codSezon: id,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Spectacol sezon sters cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
