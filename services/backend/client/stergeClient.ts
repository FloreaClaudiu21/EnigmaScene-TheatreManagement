"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";

export const stergeClient = async (id: number) => {
	await prisma.client.delete({
		where: {
			codClient: id,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Client sters cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
