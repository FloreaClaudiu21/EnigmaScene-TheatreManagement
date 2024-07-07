"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";

export const creareCameraSpectacol = async (data: any) => {
	await prisma.salaSpectacol.create({
		data,
	});
	revalidatePath("/");
	return {
		mesaj: `Camera spectacol creata cu succes.`,
		ok: true,
		status: 200,
	};
};
