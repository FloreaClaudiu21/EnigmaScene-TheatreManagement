import * as z from "zod";
import { isNumeric } from "./utils";
import { BileteAchizitionate } from "./types";

const isStrongPassword = (password: string | undefined) => {
	if (!password || password.length <= 0) {
		return true;
	}
	try {
		password = password.trim();
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const hasMinLength = password.length >= 8;
		return hasUpperCase && hasLowerCase && hasSpecialCharacter && hasMinLength;
	} catch (e) {
		return false;
	}
};

const isDateInPast = (dateString: string | undefined) => {
	if (!dateString) return true;
	const date = new Date(dateString);
	const currentDate = new Date();
	return date <= currentDate;
};

const isDateOneMonthOld = (dateString: string | undefined) => {
	if (!dateString) return true;
	const date = new Date(dateString);
	const oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	return date <= oneMonthAgo;
};

export const schemaLogareAdmin = z.object({
	email: z.string().min(4).max(150),
	parola: z.string().min(8).max(60),
});

export const schemaCreareClient = z
	.object({
		email: z
			.string()
			.min(4)
			.max(150)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		numeClient: z.string().min(4).max(150),
		prefix: z.string(),
		telefon: z
			.string()
			.min(8)
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		dataNasterii: z.string(),
		parola: z
			.string()
			.min(8)
			.max(60)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		reParola: z
			.string()
			.min(8)
			.max(60)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		termeni: z.boolean().default(false),
	})
	.refine((data) => data.reParola === data.parola, {
		message: "Parolele trebuie să se potrivească!",
		path: ["reParola"],
	})
	.refine((data) => isStrongPassword(data.parola), {
		message:
			"Parola trebuie să fie puternică (să conțină litere mari, litere mici, caractere speciale și să aibă cel puțin 8 caractere).",
		path: ["parola"],
	})
	.refine((data) => isDateInPast(data.dataNasterii), {
		message: "Data nașterii trebuie să nu fie în viitor!",
		path: ["dataNasterii"],
	})
	.refine((data) => isDateOneMonthOld(data.dataNasterii), {
		message: "Data nașterii trebuie să fie de cel puțin o lună în urmă!",
		path: ["dataNasterii"],
	});

export const schemaActualizareClient = z
	.object({
		email: z
			.string()
			.min(4)
			.max(150)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		numeClient: z.string().min(4).max(150),
		prefix: z.string(),
		telefon: z
			.string()
			.min(8)
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		dataNasterii: z.string(),
		parola: z
			.string()
			.min(8)
			.max(60)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => isStrongPassword(data.parola), {
		message:
			"Parola trebuie să fie puternică (să conțină litere mari, litere mici, caractere speciale și să aibă cel puțin 8 caractere).",
		path: ["parola"],
	})
	.refine((data) => isDateInPast(data.dataNasterii), {
		message: "Data nașterii trebuie să nu fie în viitor!",
		path: ["dataNasterii"],
	})
	.refine((data) => isDateOneMonthOld(data.dataNasterii), {
		message: "Data nașterii trebuie să fie de cel puțin o lună în urmă!",
		path: ["dataNasterii"],
	});

export const schemaCreareSpectacol = z.object({
	imagine: z.string(),
	titlu: z
		.string()
		.min(3)
		.max(150)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	descriereScurta: z.string().min(3).max(150),
	continut: z.string().min(3).max(600),
	director: z.string().min(3).max(150),
	actorii: z.string().min(3).max(255),
	oraIncepere: z.string(),
	oraTerminare: z.string(),
	codSalaSpectacol: z.number(),
	codTipSpectacol: z.number(),
	codSezon: z.number(),
});

export const schemaCreareTipSpectacol = z.object({
	numeTip: z.string().min(3).max(150),
});

export const schemaCreareSezonSpectacol = z.object({
	numeSezon: z.string().min(3).max(150),
});

export const schemaCreareSalaSpectacol = z.object({
	numarSala: z
		.string()
		.min(1)
		.max(150)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	observatii: z.string().min(5).max(255).optional(),
});

export const schemaCreareLocSalaSpectacol = z
	.object({
		tipLoc: z.string().min(3).max(150),
		pretLoc: z.string(),
		rand: z.string().max(3),
		numarLoc: z
			.string()
			.min(1)
			.max(150)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		codSalaSpectacol: z.number(),
	})
	.refine((data) => isNumeric(data.pretLoc), {
		message: "Prețul invalid, trebuie să fie un număr!",
		path: ["pretLoc"],
	})
	.refine((data) => parseFloat(data.pretLoc) > 0, {
		message: "Prețul invalid, trebuie să fie mai mare decât 0!",
		path: ["pretLoc"],
	});

export const schemaCreareBiletSpectacol = z.object({
	pretVanzare: z.string(),
	codClient: z.number(),
	codSpectacol: z.number(),
	codSalaSpectacol: z.number(),
	codRataDeSchimbValutar: z.number(),
	tipPlata: z.enum(["CARD_CREDIT", "CASH"]).default("CASH"),
	genereazaFacturaFiscala: z.string().default("false"),
	email: z
		.string()
		.min(4)
		.max(150)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	numeClient: z.string().min(4).max(150),
	prefix: z.string(),
	telefon: z
		.string()
		.min(8)
		.max(15)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	adresaFacturare: z.string(),
	bileteDetalii: z
		.object({
			pretTotal: z.number(),
			numarLocuri: z.number(),
			locuriAlese: z.any(),
		})
		.optional(),
});

export const schemaCreareFacturaFiscala = z
	.object({
		numarFactura: z.string(),
		sumaPlatita: z.string(),
		codClient: z.number(),
		codPlata: z.number(),
		codBonFiscal: z.number(),
		email: z
			.string()
			.min(4)
			.max(150)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		numeClient: z.string().min(4).max(150),
		prefix: z.string(),
		telefon: z
			.string()
			.min(8)
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		adresaFacturare: z.string(),
	})
	.refine((data) => isNumeric(data.sumaPlatita), {
		message: "Prețul total este invalid, trebuie să fie un număr!",
		path: ["sumaPlatita"],
	})
	.refine((data) => parseFloat(data.sumaPlatita) > 0, {
		message: "Prețul total este invalid, trebuie să fie mai mare decât 0!",
		path: ["sumaPlatitat"],
	});

export const schemaCreareMaterialDecorSpectacol = z
	.object({
		numeMaterial: z.string().min(3).max(150),
		cantitateStoc: z.number(),
		pretAchizitie: z.string(),
		dataAchizitie: z.string().min(2).max(150),
		unitateMastura: z
			.string()
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		producator: z
			.string()
			.min(3)
			.max(150)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		codCategorieMaterialDecor: z.number(),
	})
	.refine((data) => isNumeric(data.cantitateStoc), {
		message: "Stocul este invalid, trebuie să fie un număr!",
		path: ["cantitateStoc"],
	})
	.refine((data) => isNumeric(data.pretAchizitie), {
		message: "Prețul de achiziție este invalid, trebuie să fie un număr!",
		path: ["pretAchizitie"],
	})
	.refine((data) => data.cantitateStoc > 0, {
		message: "Stocul este invalid, trebuie să fie mai mare decât 0!",
		path: ["cantitateStoc"],
	})
	.refine((data) => parseFloat(data.pretAchizitie) > 0, {
		message:
			"Prețul de achiziție este invalid, trebuie să fie mai mare decât 0!",
		path: ["pretAchizitie"],
	});

export const schemaCreareMaterialDecorSpectacolFolosit = z
	.object({
		cantitateaFolosita: z.number(),
		cantitateaRamasaPeStoc: z.number(),
		dataFolosirii: z.string().min(2).max(150),
		codSpectacol: z.number(),
		codMaterialDecorSpectacol: z.number(),
		observatii: z.string().min(5).max(255).optional(),
	})
	.refine((data) => isNumeric(data.cantitateaFolosita), {
		message: "Cantitatea folosita este invalidă, trebuie să fie un număr!",
		path: ["cantitateaFolosita"],
	})
	.refine((data) => data.cantitateaFolosita > 0, {
		message:
			"Cantitatea folosita este invalidă, trebuie să fie mai mare decât 0!",
		path: ["cantitateaFolosita"],
	})
	.refine((data) => isNumeric(data.cantitateaRamasaPeStoc), {
		message:
			"Cantitatea rămasă pe stoc este invalidă, trebuie să fie un număr!",
		path: ["cantitateRamasaPeStoc"],
	})
	.refine((data) => data.cantitateaRamasaPeStoc >= 0, {
		message:
			"Cantitatea rămasă pe stoc este invalidă, trebuie să fie mai mare sau egală cu 0!",
		path: ["cantitateRamasaPeStoc"],
	});

export const schemaCreareCategorieMaterialDecor = z.object({
	numeCategorie: z.string().min(3).max(150),
});

export const schemaCreareAdresaFacturareClient = z.object({
	codClient: z.number(),
	adresa: z.string().min(5).max(255),
	observatii: z.string().min(5).max(255).optional(),
	codPostal: z
		.string()
		.min(4)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	oras: z
		.string()
		.min(5)
		.max(30)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	tara: z
		.string()
		.min(4)
		.max(30)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
});
