"use server";
import { prisma } from "@/lib/prismaClient";
import { obtineClientDupaEmail } from "./obtineClientDupaEmail";
import { revalidatePath } from "next/cache";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareClient = async (data: any) => {
	try {
		const gasit = await obtineClientDupaEmail(data.email);
		if (!gasit) {
			return {
				mesaj: `Clientul cu adresa de email '${data.email}' nu există.`,
				status: 404,
				ok: false,
			} as RaspunsTrimitereEmail;
		}
		await prisma.client.update({
			where: {
				email: data.email,
			},
			data: {
				dataNasterii: data.dataNasterii,
				email: data.email,
				numeClient: data.numeClient,
				telefon: data.telefon,
			},
		});
		revalidatePath("/");
		return {
			mesaj: `Clientul actualizat cu succes.`,
			ok: true,
			status: 200,
		} as RaspunsTrimitereEmail;
	} catch (e) {
		console.log(e);
		return {
			ok: false,
			mesaj: e instanceof Error ? e.message : "Unknown error",
			status: 500,
		} as RaspunsTrimitereEmail;
	}
};
