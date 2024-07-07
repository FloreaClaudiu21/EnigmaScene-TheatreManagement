"use server";
import { prisma } from "@/lib/prismaClient";
import { schemaCreareAdresaFacturareClient } from "@/lib/schemeFormulare";
import { AdresaFacturare } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const adaugaAdresaFacturare = async (
	id: number,
	valori: z.infer<typeof schemaCreareAdresaFacturareClient>
) => {
	try {
		const adresa = await prisma.adresaFacturare.create({
			data: {
				codClient: id,
				tara: valori.tara,
				adresa: valori.adresa,
				oras: valori.oras,
				codPostal: valori.codPostal,
				observatii: valori.observatii,
			},
		});
		revalidatePath("/");
		return adresa as AdresaFacturare;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const stergeAdresaFacturare = async (id: number) => {
	try {
		const adresa = await prisma.adresaFacturare.delete({
			where: {
				codAdresa: id,
			},
		});
		revalidatePath("/");
		return adresa as AdresaFacturare;
	} catch (e) {
		console.log(e);
		return null;
	}
};
