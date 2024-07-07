"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { obtineSezonSpectacolDupaId } from "./obtineSezonSpectacolDupaId";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareSpectacolSezon = async (date: any, id: number) => {
	const gasit = await obtineSezonSpectacolDupaId(id);
	if (!gasit) {
		return {
			mesaj: `Sezon spectacol cu ID-ul '${id}' nu există.`,
			ok: false,
			status: 404,
		} as RaspunsTrimitereEmail;
	}
	await prisma.sezon.update({
		where: {
			codSezon: id,
		},
		data: date,
	});
	revalidatePath("/");
	return {
		mesaj: `Sezon spectacol actualizat cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
