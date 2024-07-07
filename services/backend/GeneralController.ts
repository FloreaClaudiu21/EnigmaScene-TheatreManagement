"use server";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";
import { RaspunsTrimitereEmail, TipuriTabel } from "@/lib/tipuri";
import { creareClient } from "./client/creareClient";
import { creareSpectacol } from "./spectacole/creareSpectacol";
import { creareSpectacolCategorie } from "./spectacole/creareSpectacolCategorie";
import { creareSpectacolSezon } from "./spectacole/creareSpectacolSezon";
import { creareCameraSpectacol } from "./spectacole/creareCameraSpectacol";
import { creareScaunCameraSpectacol } from "./spectacole/creareScaunCameraSpectacol";
import { creareFactura } from "./facturi/creareFactura";
import { createBiletSpectacol } from "./bilete/creareBilet";
import { stergeClient } from "./client/stergeClient";
import { stergeSpectacol } from "./spectacole/stergeSpectacol";
import { stergeSpectacolCategorie } from "./spectacole/stergeSpectacolCategorie";
import { stergeSpectacolSezon } from "./spectacole/stergeSpectacolSezon";
import { stergeSalaSpectacol } from "./spectacole/stergeSalaSpectacol";
import { stergeScaunSalaSpectacol } from "./spectacole/stergeScaunSalaSpectacol";
import { stergeBiletSpectacol } from "./bilete/stergeBiletSpectacol";
import { stergeFacturaFiscala } from "./facturi/stergeFacturaFiscala";
import { actualizareClient } from "./client/actualizareClient";
import { actualizareSpectacol } from "./spectacole/actualizareSpectacol";
import { actualizareSpectacolCategorie } from "./spectacole/actualizareSpectacolCategorie";
import { actualizareSpectacolSezon } from "./spectacole/actualizareSpectacolSezon";
import { actualizareSalaSpectacol } from "./spectacole/actualizareSalaSpectacol";
import { actualizareScaunSalaSpectacol } from "./spectacole/actualizareScaunSalaSpectacol";
import { actualizareBiletSpectacol } from "./bilete/actualizareBiletSpectacol";
import { actualizareFacturaFiscala } from "./facturi/actualizareFacturaFiscala";
import { cripteazaParola } from "../auth/autentificare";

const typeByName = (type: TipuriTabel) => {
	return capitalizeazaPrimaLitera(type.toString().toLowerCase());
};

export const inserare = async (type: TipuriTabel, data: any) => {
	const what = typeByName(type);
	try {
		switch (type) {
			case TipuriTabel.CLIENT: {
				return await creareClient(data);
			}
			case TipuriTabel.SPECTACOL: {
				return await creareSpectacol(data);
			}
			case TipuriTabel.CATEGORIE_SPECTACOL: {
				return await creareSpectacolCategorie(data);
			}
			case TipuriTabel.SEZON_SPECTACOL: {
				return await creareSpectacolSezon(data);
			}
			case TipuriTabel.CAMERA_SPECTACOL: {
				return await creareCameraSpectacol(data);
			}
			case TipuriTabel.SCAUN_CAMERA_SPECTACOL: {
				return await creareScaunCameraSpectacol(data);
			}
			case TipuriTabel.BILET: {
				return await createBiletSpectacol(data);
			}
			case TipuriTabel.FACTURA_FISCALA: {
				return await creareFactura(data);
			}
			default: {
				return {
					mesaj: "Tip nedefinit",
					status: 404,
					ok: false,
				} as RaspunsTrimitereEmail;
			}
		}
	} catch (e) {
		console.log("Add Error: " + e);
		if (e instanceof Error) {
			console.log(e);
			return {
				mesaj: e.toString(),
				status: 500,
				ok: false,
			} as RaspunsTrimitereEmail;
		} else {
			return {
				mesaj: `A apărut o eroare necunoscută în timpul creării '${what}'. Vă rugăm să încercați din nou mai târziu.`,
				status: 500,
				ok: false,
			} as RaspunsTrimitereEmail;
		}
	}
};

export const actualizare = async (type: TipuriTabel, data: any, id: number) => {
	const what = typeByName(type);
	if (!data)
		return {
			mesaj: "no data",
			status: 500,
			ok: false,
		} as RaspunsTrimitereEmail;
	try {
		switch (type) {
			case TipuriTabel.CLIENT: {
				return await actualizareClient(data);
			}
			case TipuriTabel.SPECTACOL: {
				return await actualizareSpectacol(data, id);
			}
			case TipuriTabel.CATEGORIE_SPECTACOL: {
				return await actualizareSpectacolCategorie(data, id);
			}
			case TipuriTabel.SEZON_SPECTACOL: {
				return await actualizareSpectacolSezon(data, id);
			}
			case TipuriTabel.CAMERA_SPECTACOL: {
				return await actualizareSalaSpectacol(data, id);
			}
			case TipuriTabel.SCAUN_CAMERA_SPECTACOL: {
				return await actualizareScaunSalaSpectacol(data, id);
			}
			case TipuriTabel.BILET: {
				return await actualizareBiletSpectacol(data, id);
			}
			case TipuriTabel.FACTURA_FISCALA: {
				return await actualizareFacturaFiscala(data, id);
			}
			default: {
				return {
					mesaj: "Tip nedefinit",
					status: 404,
					ok: false,
				} as RaspunsTrimitereEmail;
			}
		}
	} catch (e) {
		console.log("Update Error: " + e);
		if (e instanceof Error) {
			return {
				mesaj: e.toString(),
				status: 500,
				ok: false,
			} as RaspunsTrimitereEmail;
		} else {
			return {
				mesaj: `A apărut o eroare necunoscută în timpul actualizării ${what}. Vă rugăm să încercați din nou mai târziu.`,
				status: 500,
				ok: false,
			} as RaspunsTrimitereEmail;
		}
	}
};

export const sterge = async (type: TipuriTabel, id: number) => {
	const what = typeByName(type);
	try {
		switch (type) {
			case TipuriTabel.CLIENT:
				return await stergeClient(id);
			case TipuriTabel.SPECTACOL:
				return await stergeSpectacol(id);
			case TipuriTabel.CATEGORIE_SPECTACOL:
				return await stergeSpectacolCategorie(id);
			case TipuriTabel.SEZON_SPECTACOL:
				return await stergeSpectacolSezon(id);
			case TipuriTabel.CAMERA_SPECTACOL:
				return await stergeSalaSpectacol(id);
			case TipuriTabel.SCAUN_CAMERA_SPECTACOL:
				return await stergeScaunSalaSpectacol(id);
			case TipuriTabel.BILET:
				return await stergeBiletSpectacol(id);
			case TipuriTabel.FACTURA_FISCALA:
				return await stergeFacturaFiscala(id);
			default: {
				return {
					mesaj: "Tip nedefinit",
					status: 404,
					ok: false,
				} as RaspunsTrimitereEmail;
			}
		}
	} catch (e) {
		console.log("Delete Error: " + e);
		if (e instanceof Error) {
			return {
				mesaj: e.toString(),
				status: 500,
				ok: false,
			} as RaspunsTrimitereEmail;
		} else {
			return {
				mesaj: `A apărut o eroare necunoscută în timpul ștergerii ${what}. Vă rugăm să încercați din nou mai târziu.`,
				status: 500,
				ok: false,
			} as RaspunsTrimitereEmail;
		}
	}
};
