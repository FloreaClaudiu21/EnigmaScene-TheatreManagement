"use server";
import { prisma } from "@/lib/prismaClient";
import { cripteazaParola } from "@/services/auth/autentificare";
import { obtineClientDupaEmail } from "./obtineClientDupaEmail";
import { revalidatePath } from "next/cache";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareClient = async (data: any) => {
	console.log(data.numeClient + "");
	const dateInregistrare = {
		...data,
		parola: await cripteazaParola(data.parola),
	};
	const gasit = await obtineClientDupaEmail(dateInregistrare.email);
	if (!gasit) {
		return {
			mesaj: `Clientul cu adresa de email '${dateInregistrare.email}' nu există.`,
			status: 404,
			ok: false,
		} as RaspunsTrimitereEmail;
	}
	try {
		await prisma.client.update({
			where: {
				email: data.email,
			},
			data: dateInregistrare,
		});
	} catch (e) {
		console.log(e);
	}
	revalidatePath("/");
	return {
		mesaj: `Clientul actualizat cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
