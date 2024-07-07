"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";

export const stergeScaunSalaSpectacol = async (id: number) => {
	await prisma.spectacol.delete({
		where: {
			codSpectacol: id,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Scaun sala spectacol sters cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
