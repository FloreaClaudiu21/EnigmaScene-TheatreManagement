"use server";
import { prisma } from "@/lib/prismaClient";
import { BiletSpectacol } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";

export const verificareBiletSpectacol = async (data: BiletSpectacol) => {
	try {
		await prisma.biletSpectacol.update({
			where: {
				codBiletSpectacol: data.codBiletSpectacol,
			},
			data: {
				biletVerificat: !data.biletVerificat,
			},
		});
		return { ok: true };
	} catch (e) {
		console.log("Eroare verificare bilet: " + e);
		return { ok: false };
	} finally {
		revalidatePath("/");
	}
};
