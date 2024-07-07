"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";

export const creareScaunCameraSpectacol = async (data: any) => {
	await prisma.locSalaSpectacol.create({
		data: {
			...data,
			codSalaSpectacol: parseInt(data.codSalaSpectacol),
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Scaun camera creat cu succes.`,
		ok: true,
		status: 200,
	};
};
