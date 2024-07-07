"use server";
import { prisma } from "@/lib/prismaClient";
import { schemaCreareBiletSpectacol } from "@/lib/schemeFormulare";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { obtineUltimaFacturaCreata } from "../facturi/obtineUltimaFacturaCreata";
import { LocSalaSpectacol } from "@/lib/tipuri";
import { genereazaSirAleator } from "@/lib/metodeUtile";

export const createBiletSpectacol = async (data: any) => {
	const valori = data as z.infer<typeof schemaCreareBiletSpectacol>;
	const plata = await prisma.plata.create({
		data: {
			tipPlata: valori.tipPlata,
			codClient: valori.codClient,
			sumaPlatita: parseFloat(valori.bileteDetalii?.pretTotal + ""),
		},
	});
	const bonFiscal = await prisma.bonFiscal.create({
		data: {
			codPlata: plata.codPlata,
			codClient: valori.codClient,
			codSpectacol: valori.codSpectacol,
			numarBonFiscal: "#" + genereazaSirAleator(6),
		},
	});
	const locuri: LocSalaSpectacol[] = valori.bileteDetalii?.locuriAlese ?? [];
	let codFactura = undefined;
	if (valori.genereazaFacturaFiscala == "true") {
		const ultimaFactura = await obtineUltimaFacturaCreata();
		const ultimulId = ultimaFactura ? ultimaFactura.codFactura + 1 : 1;
		const factura = await prisma.facturaFiscala.create({
			data: {
				adresaFacturare: valori.adresaFacturare,
				email: valori.email,
				numeClient: valori.numeClient,
				codClient: valori.codClient,
				telefon: valori.prefix + valori.telefon,
				numarFactura: ultimulId.toString().padStart(6, "0"),
				costuriExtra: 0,
				totalSumaPlatita: parseFloat(valori.bileteDetalii?.pretTotal + "") + 0,
				sumaPlatita: parseFloat(valori.bileteDetalii?.pretTotal + ""),
				dataScadentei: new Date(),
				codBonFiscal: bonFiscal.codBonFiscal,
				codPlata: plata.codPlata,
			},
		});
		codFactura = factura.codFactura;
	}
	await Promise.all(
		locuri.map(async (loc) => {
			await prisma.biletSpectacol.create({
				data: {
					biletVerificat: false,
					numarBilet: genereazaSirAleator(5),
					codPlata: plata.codPlata,
					codClient: valori.codClient,
					codSpectacol: valori.codSpectacol,
					codSalaSpectacol: valori.codSalaSpectacol,
					codLocSalaSpectacol: loc.codLocSala,
					codBonFiscal: bonFiscal.codBonFiscal,
					codFacturaFiscala: codFactura,
					pretVanzare: parseFloat(loc.pretLoc + ""),
				},
			});
		})
	);
	revalidatePath("/");
	return {
		mesaj: `Bilet spectacol creat cu succes.`,
		ok: true,
		status: 200,
	};
};
