"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";

export const creareSpectacolSezon = async (data: any) => {
	await prisma.sezon.create({
		data,
	});
	revalidatePath("/");
	return {
		mesaj: `Spectacol sezon creat cu succes.`,
		ok: true,
		status: 200,
	};
};
