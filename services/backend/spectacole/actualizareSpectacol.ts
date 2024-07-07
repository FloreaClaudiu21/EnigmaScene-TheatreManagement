"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { obtineSpectacolDupaId } from "./obtineSpectacolDupaId";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareSpectacol = async (date: any, id: number) => {
	const gasit = await obtineSpectacolDupaId(id);
	if (!gasit) {
		return {
			mesaj: `Spectacolul cu ID-ul '${id}' nu există.`,
			ok: false,
			status: 404,
		} as RaspunsTrimitereEmail;
	}
	await prisma.spectacol.update({
		where: {
			codSpectacol: id,
		},
		data: {
			...date,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Spectacolul actualizat cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
