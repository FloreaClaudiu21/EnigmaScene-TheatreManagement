"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";

export const stergeSpectacol = async (id: number) => {
	await prisma.spectacol.delete({
		where: {
			codSpectacol: id,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Spectacol sters cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
