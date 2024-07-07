"use server";
import { prisma } from "@/lib/prismaClient";
import { schemaCreareBiletSpectacol } from "@/lib/schemeFormulare";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { obtineBiletVandutDupaId } from "./obtineBiletVandutDupaId";
import { obtineUltimaFacturaCreata } from "../facturi/obtineUltimaFacturaCreata";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

export const actualizareBiletSpectacol = async (date: any, id: number) => {
	const gasit = await obtineBiletVandutDupaId(id);
	if (!gasit) {
		return {
			mesaj: `Bilet spectacol cu ID-ul '${id}' nu există.`,
			ok: false,
			status: 404,
		} as RaspunsTrimitereEmail;
	}
	const valori = date as z.infer<typeof schemaCreareBiletSpectacol>;
	const plata = await prisma.plata.update({
		where: {
			codPlata: gasit.codPlata,
		},
		data: {
			codClient: valori.codClient,
			sumaPlatita: parseFloat(valori.pretVanzare),
		},
	});
	await prisma.biletSpectacol.update({
		where: {
			codBiletSpectacol: id,
		},
		data: {
			codPlata: plata.codPlata,
			codClient: valori.codClient,
			codSpectacol: valori.codSpectacol,
			codSalaSpectacol: valori.codSalaSpectacol,
		},
	});
	const fiscal = await prisma.bonFiscal.update({
		where: {
			codPlata: plata.codPlata,
		},
		data: {
			codClient: valori.codClient,
			codSpectacol: valori.codSpectacol,
		},
	});
	let codFactura = undefined;
	if (valori.genereazaFacturaFiscala == "true") {
		if (gasit.codFacturaFiscala != null) {
			await prisma.facturaFiscala.update({
				where: {
					codPlata: plata.codPlata,
				},
				data: {
					email: valori.email,
					telefon: valori.prefix + valori.telefon,
					numeClient: valori.numeClient,
					adresaFacturare: valori.adresaFacturare,
					costuriExtra: 0,
					codClient: valori.codClient,
					totalSumaPlatita: parseFloat(valori.pretVanzare) + 0,
					sumaPlatita: parseFloat(valori.pretVanzare),
					codBonFiscal: fiscal.codBonFiscal,
					codPlata: plata.codPlata,
				},
			});
		} else {
			const ultimaFactura = await obtineUltimaFacturaCreata();
			const idFactura = ultimaFactura ? ultimaFactura.codFactura + 1 : 1;
			const factura = await prisma.facturaFiscala.create({
				data: {
					email: valori.email,
					telefon: valori.prefix + valori.telefon,
					numeClient: valori.numeClient,
					costuriExtra: 0,
					adresaFacturare: valori.adresaFacturare,
					numarFactura: idFactura.toString().padStart(6, "0"),
					totalSumaPlatita: parseFloat(valori.pretVanzare) + 0,
					sumaPlatita: parseFloat(valori.pretVanzare),
					dataScadentei: new Date(),
					codBonFiscal: fiscal.codBonFiscal,
					codPlata: plata.codPlata,
					codClient: valori.codClient,
				},
			});
			codFactura = factura.codFactura;
		}
	}
	await prisma.biletSpectacol.updateMany({
		where: {
			codPlata: gasit.codPlata,
		},
		data: {
			codPlata: plata.codPlata,
			codClient: valori.codClient,
			codSpectacol: valori.codSpectacol,
			codSalaSpectacol: valori.codSalaSpectacol,
			codFacturaFiscala: codFactura ?? gasit.codFacturaFiscala,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Bilet spectacol actualizat cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
