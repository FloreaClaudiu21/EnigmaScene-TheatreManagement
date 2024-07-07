"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";

export const stergeSpectacolCategorie = async (id: number) => {
	await prisma.tipSpectacol.delete({
		where: {
			codTipSpectacol: id,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Spectacol categorie sters cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
