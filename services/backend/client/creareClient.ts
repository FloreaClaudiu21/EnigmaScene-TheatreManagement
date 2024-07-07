"use server";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { obtineClientDupaEmail } from "./obtineClientDupaEmail";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { esteEmailAsociat } from "@/services/auth/autentificare";

export const creareClient = async (data: any) => {
	const dateInregistrare = {
		...data,
		parola: "",
		emailVerificat: new Date(),
	};
	const gasit = await obtineClientDupaEmail(dateInregistrare.email);
	if (gasit) {
		return {
			mesaj: `Clientul cu adresa de email '${gasit.email}' există deja.`,
			status: 404,
			ok: false,
		} as RaspunsTrimitereEmail;
	}
	const gasitAsociere = await esteEmailAsociat(dateInregistrare.email);
	if (gasitAsociere) {
		return {
			mesaj: `Adresa de email '${dateInregistrare.email}' este deja asociată cu un alt cont.`,
			status: 404,
			ok: false,
		} as RaspunsTrimitereEmail;
	}
	const client = await prisma.client.create({
		data: dateInregistrare,
	});
	revalidatePath("/");
	return {
		mesaj: `Clientul creata cu succes.`,
		ok: true,
		status: 200,
		client: client,
	} as RaspunsTrimitereEmail;
};
