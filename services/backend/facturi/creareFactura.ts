"use server";
import { prisma } from "@/lib/prismaClient";
import { schemaCreareFacturaFiscala } from "@/lib/schemeFormulare";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const creareFactura = async (data: any) => {
	const valori = data as z.infer<typeof schemaCreareFacturaFiscala>;
	await prisma.facturaFiscala.create({
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
			dataScadentei: new Date(),
			totalSumaPlatita: parseFloat(valori.sumaPlatita) + 0,
			sumaPlatita: parseFloat(valori.sumaPlatita),
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Factura fiscala creata cu succes.`,
		ok: true,
		status: 200,
	};
};
