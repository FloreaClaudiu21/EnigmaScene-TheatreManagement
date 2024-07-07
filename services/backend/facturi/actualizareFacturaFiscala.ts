"use server";
import { prisma } from "@/lib/prismaClient";
import { schemaCreareFacturaFiscala } from "@/lib/schemeFormulare";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const actualizareFacturaFiscala = async (date: any, id: number) => {
	const valori = date as z.infer<typeof schemaCreareFacturaFiscala>;
	await prisma.facturaFiscala.update({
		where: {
			codFactura: id,
		},
		data: {
			costuriExtra: 0,
			codPlata: valori.codPlata,
			codClient: valori.codClient,
			codBonFiscal: valori.codBonFiscal,
			telefon: valori.prefix + valori.telefon,
			numarFactura: valori.numarFactura,
			adresaFacturare: valori.adresaFacturare,
			email: valori.email,
			numeClient: valori.numeClient,
			sumaPlatita: parseFloat(valori.sumaPlatita),
			totalSumaPlatita: parseFloat(valori.sumaPlatita) + 0,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Factura fiscala actualizata cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
