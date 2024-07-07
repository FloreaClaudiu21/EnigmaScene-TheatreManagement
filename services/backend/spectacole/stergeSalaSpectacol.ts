"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";

export const stergeSalaSpectacol = async (id: number) => {
	await prisma.salaSpectacol.delete({
		where: {
			codSalaSpectacol: id,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Sala spectacol sters cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
