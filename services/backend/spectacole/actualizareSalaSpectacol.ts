"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { obtineSalaSpectacolDupaId } from "./obtineCameraSpectacolDupaId";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareSalaSpectacol = async (date: any, id: number) => {
	const gasit = await obtineSalaSpectacolDupaId(id);
	if (!gasit) {
		return {
			mesaj: `Sala spectacol cu ID-ul '${id}' nu există.`,
			ok: false,
			status: 404,
		} as RaspunsTrimitereEmail;
	}
	await prisma.salaSpectacol.update({
		where: {
			codSalaSpectacol: id,
		},
		data: date,
	});
	revalidatePath("/");
	return {
		mesaj: `Bilet creata cu succes.`,
		ok: true,
		status: 200,
	};
};
