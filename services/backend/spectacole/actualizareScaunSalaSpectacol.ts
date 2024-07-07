"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { obtineLocSalaSpectacolDupaId } from "./obtineLocSalaSpectacolDupaId";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareScaunSalaSpectacol = async (date: any, id: number) => {
	const gasit = await obtineLocSalaSpectacolDupaId(id);
	if (!gasit) {
		return {
			mesaj: `Scaun sala spectacol cu ID-ul '${id}' nu există.`,
			ok: false,
			status: 404,
		} as RaspunsTrimitereEmail;
	}
	await prisma.locSalaSpectacol.update({
		where: {
			codLocSala: id,
		},
		data: {
			...date,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Scaun sala spectacol actualizat cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
