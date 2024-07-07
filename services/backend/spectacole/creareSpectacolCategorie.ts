"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";

export const creareSpectacolCategorie = async (data: any) => {
	await prisma.tipSpectacol.create({
		data,
	});
	revalidatePath("/");
	return {
		mesaj: `Tip Spectacol creat cu succes.`,
		ok: true,
		status: 200,
	};
};
