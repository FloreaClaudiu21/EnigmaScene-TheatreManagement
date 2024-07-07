"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { obtineCategorieSpectacolDupaId } from "./obtineSpectacolCategorieDupaId";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareSpectacolCategorie = async (date: any, id: number) => {
	const gasit = await obtineCategorieSpectacolDupaId(id);
	if (!gasit) {
		return {
			mesaj: `Categorie spectacol cu ID-ul '${id}' nu există.`,
			ok: false,
			status: 404,
		} as RaspunsTrimitereEmail;
	}
	await prisma.tipSpectacol.update({
		where: {
			codTipSpectacol: id,
		},
		data: date,
	});
	revalidatePath("/");
	return {
		mesaj: `Categorie spectacol actualizat cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
