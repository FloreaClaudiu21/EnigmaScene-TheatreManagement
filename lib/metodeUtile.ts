
import { getLocalTimeZone } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { Header } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FilterMap, TableFilterMap } from "@/components/admin/table/GeneralTabel";
import { DateRange } from "react-day-picker";
import { ModalRaport } from "@/services/general/FurnizorStare";
import { ParametruFiltru } from "./tipuri";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeazaString(str: string): string {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
export const esteParolaPuternica = (parola: string | undefined) => {
	if (!parola || parola.length <= 0) {
		return true; 
	}
	try {
		parola = parola.trim();
		const areLitereMajuscule = /[A-Z]/.test(parola);
		const areLitereMinuscule = /[a-z]/.test(parola);
		const areCaractereSpeciale = /[!@#$%^&*(),.?":{}|<>]/.test(parola);
		const areMinimLungime = parola.length >= 8;
		return areLitereMajuscule && areLitereMinuscule && areCaractereSpeciale && areMinimLungime;
	} catch (e) {
		return false; 
	}
};

export const esteDataInTrecut = (dataString: string | undefined) => {
	if (!dataString) return true; 
	const data = new Date(dataString);
	const dataCurenta = new Date();
	return data <= dataCurenta;
};

export const esteDataCuOLunaInUrma = (dataString: string | undefined) => {
	if (!dataString) return true; 
	const data = new Date(dataString);
	const oLunaInUrma = new Date();
	oLunaInUrma.setMonth(oLunaInUrma.getMonth() - 1);
	return data <= oLunaInUrma;
};

export function incepeCuIgnorareDiacritice(str: string, valoare: string): boolean {
	const strNormalizat = normalizeazaString(str);
	const prefixNormalizat = normalizeazaString(valoare);
	return strNormalizat.startsWith(prefixNormalizat);
}

type OriceObiect = { [cheie: string]: any };

export function parseazaParametriiQuery(params: any, filtre?: FilterMap[]): ParametruFiltru[] {
	const queryParams: ParametruFiltru[] = [];
	const totiParametrii = new URLSearchParams(params);
	const cheiExcluse = ["tab", "to", "from"];
	if (filtre && filtre.length > 0) {
		for (const [cheie, valoare] of totiParametrii.entries()) {
			if (cheiExcluse.includes(cheie)) continue;
			let text = cheie;
			const gasit = filtre.filter((v) => v.column == cheie);
			if (gasit.length > 0) {
				text = gasit[0].label;
			}
			queryParams.push({ coloana: cheie, eticheta: text, pagina: "", valoare: valoare });
		}
	} else {
		for (const [cheie, valoare] of totiParametrii.entries()) {
			if (cheiExcluse.includes(cheie)) continue;
			queryParams.push({ coloana: cheie, eticheta: cheie.toUpperCase(), pagina: "", valoare: valoare });
		}
	}
	return queryParams;
}

export const formateazaData = (data: Date) => {
  const zi = String(data.getDate()).padStart(2, '0');
  const luna = String(data.getMonth() + 1).padStart(2, '0');
  const an = data.getFullYear();
  return `${zi}-${luna}-${an}`;
};


export function genereazaSirAleator(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const gestioneazaSchimbareaDateiPredefinite = (perioada: string): DateRange | undefined => {
	let dataDeInceput;
  const dataDeSfarsit = new Date();
	switch (perioada) {
		case 'azi':
			dataDeInceput = new Date();
			break;
		case 'ziuaTrecuta':
			dataDeInceput = new Date(dataDeSfarsit);
			dataDeInceput.setDate(dataDeSfarsit.getDate() - 1);
			break;
		case 'ultimele7Zile':
			dataDeInceput = new Date(dataDeSfarsit);
			dataDeInceput.setDate(dataDeSfarsit.getDate() - 7);
			break;
		case 'ultimele30Zile':
			dataDeInceput = new Date(dataDeSfarsit);
			dataDeInceput.setDate(dataDeSfarsit.getDate() - 30);
			break;
		case 'ultimele60Zile':
			dataDeInceput = new Date(dataDeSfarsit);
			dataDeInceput.setDate(dataDeSfarsit.getDate() - 60);
			break;
		case 'ultimele90Zile':
			dataDeInceput = new Date(dataDeSfarsit);
			dataDeInceput.setDate(dataDeSfarsit.getDate() - 90);
			break;
		case 'ultimele6Luni':
			dataDeInceput = new Date(dataDeSfarsit);
			dataDeInceput.setMonth(dataDeSfarsit.getMonth() - 6);
			break;
		case 'ultimele9Luni':
			dataDeInceput = new Date(dataDeSfarsit);
			dataDeInceput.setMonth(dataDeSfarsit.getMonth() - 9);
			break;
		default:
			return;
	}
	return { from: dataDeInceput, to: dataDeSfarsit };
};

export function stergeParametruQuery(cheie: string, searchParams: any) {
	const totiParametrii = new URLSearchParams(searchParams);
	totiParametrii.delete(cheie);
	return totiParametrii.toString();
}

export function seteazaParametriiQuery(searchParams: any, filtreTabel: TableFilterMap) {
	const params = new URLSearchParams(searchParams);
	filtreTabel.filters.map((filtru) => {
		if (!filtru || !filtru.column ||  (filtru.value?.length ?? 0) <= 0) return;
		const valoareCurenta = params.get(filtru.column);
    if (valoareCurenta === filtru.value) {
      params.delete(filtru.column);
    } else {
      params.set(filtru.column, filtru.value ?? '');
    }
	});
	params.set("from", formateazaData(filtreTabel.date?.from ?? new Date()));
	if (filtreTabel.date?.to) {
		params.set("to", formateazaData(filtreTabel.date?.to));
	}
	return params.toString();
}

export function stergeParametriiQuery() {
	return "";
}

export function esteValoareData(str: string) {
	if (esteNumeric(str)) {
		return false;
	}
	const data = new Date(str);
	return !isNaN(data.getTime());
}

export function esteStringData(str: string) {
	if (esteNumeric(str)) {
		return {
			check: false,
			date: null
		}
	}
	if (!str.includes("-")) {
		return {
			check: false,
			date: null
		}
	}
	const parti = str.split("-");
  if (parti.length !== 3) {
    console.error("Formatul datei este invalid. Format așteptat: ZI-LUNA-AN");
    return {
			check: false,
			date: null
		}
  }
	const zi = parseInt(parti[0]);
  const luna = parseInt(parti[1]) - 1;
  const an = parseInt(parti[2]);
  if (isNaN(zi) || isNaN(luna) || isNaN(an)) {
    console.error("Componentele datei sunt invalide.");
    return {
			check: false,
			date: null
		}
  }
  const dataInput = new Date(an, luna, zi);
	return {
		check: true,
		date: dataInput
	};
}

export function esteAceeasiZi(dataCurenta: Date, stringData: string): boolean {
	const rezultat = esteStringData(stringData);
	if (!rezultat.check) return false;
	const dataInput = rezultat.date!;
	return (
		dataCurenta.getFullYear() === dataInput.getFullYear() &&
		dataCurenta.getMonth() === dataInput.getMonth() &&
		dataCurenta.getDate() === dataInput.getDate()
	);
}

export function gasesteValoareDupaCheie(obj: OriceObiect, cheie: string): any {
  if (obj.hasOwnProperty(cheie)) {
    return obj[cheie];
  }
  for (const k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      const rezultat = gasesteValoareDupaCheie(obj[k], cheie);
			if (rezultat !== undefined && typeof rezultat !== 'object') {
				return rezultat;
			}
    }
  }
  return undefined;
}

export function filtreazaListaDupaCheiSiValori(arr: any[], searchParams: any): any[] {
	const criteriiFiltrare = parseazaParametriiQuery(searchParams);
	if (criteriiFiltrare.length <= 0) return arr;
	return arr.filter(item => {
		for (const filtru of criteriiFiltrare) {
			const valoare = filtru.valoare;
			const coloana = filtru.coloana;
			if (coloana === "tab" || coloana === "from" || coloana === "to") continue;
			const valoareItem = gasesteValoareDupaCheie(item, coloana);
			///////////////////////////////////////////////
			if (valoareItem === undefined || valoareItem == '') {
				return false;
			} else if (typeof valoareItem === "number" && (!esteNumeric(valoare) || parseInt(valoare) !== valoareItem)) {
				return false;
			} else if (esteValoareData(valoareItem)) {
				return esteAceeasiZi(new Date(valoareItem), valoare);
			} else if (typeof valoareItem === "string" && !incepeCuIgnorareDiacritice(valoareItem, valoare)) {
				return false;
			}
		}
		return true;
	});
}

export function filtreazaListaDupaCheieSiValoare(arr: any[], cheie: string, valoare: any): any[] {
	return arr.filter(item => {
		if (item[cheie] !== undefined) {
			return item[cheie] === valoare;
		}
		const gasesteValoareDupaCheie = (obj: any, cheie: string): any => {
			if (obj.hasOwnProperty(cheie)) {
				return obj[cheie];
			}
			for (const k

 in obj) {
				if (obj[k] && typeof obj[k] === 'object') {
					const rezultat = gasesteValoareDupaCheie(obj[k], cheie);
					if (rezultat !== undefined) {
						return rezultat;
					}
				}
			}
			return undefined;
		};
		const valoareItem = gasesteValoareDupaCheie(item, cheie);
    if (valoareItem !== undefined) {
      return incepeCuIgnorareDiacritice(valoareItem, valoare);
    }
    return false;
	});
}

const gasesteValoareImbricata = (obj:any, cheie: any) => {
	if (obj.hasOwnProperty(cheie)) {
			return obj[cheie];
	}
	for (const prop in obj) {
			if (obj[prop] && typeof obj[prop] === 'object') {
					const rezultat: any = gasesteValoareImbricata(obj[prop], cheie);
					if (rezultat !== undefined) {
							return rezultat;
					}
			}
	}
	return undefined;
};

export function randuriSiColoaneValide(raportModal: ModalRaport) {
	const randuriDate = raportModal.raport?.getCoreRowModel().rows;
	const coloaneDate = raportModal.raport
		?.getHeaderGroups()[0]
		.headers.filter(
			(header) =>
				header.column.getIsVisible() &&
				header.column.id != "select" &&
				header.column.id != "actions" && header.column.id != "photo"
		);
	const coloaneValide: Header<any, unknown>[] = [];
	coloaneDate?.map((col) => {
		randuriDate?.map((rand) => {
			const valoare = gasesteValoareImbricata(rand.original, col.id);
			const tip = typeof valoare;
			const esteData = valoare instanceof Date;
			if (valoare != undefined) {
				rand.original[col.id] = valoare;
			}
			if (
				valoare != undefined &&
				(tip == "number" || tip == "string" || esteData || tip == "boolean")
			) {
				if (!coloaneValide.includes(col)) {
					coloaneValide.push(col);
				}
			}
		});
	});
	return {coloane: coloaneValide, randuri: randuriDate ?? []}
}

export function eliminaDiacritice(str: string) {
	if (typeof str != 'string') {
		return str;
	}
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function genereazaStringAleatoriu(lungime: number) {
	let rezultat = '';
	const caractere = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const lungimeCaractere = caractere.length;
	for (let i = 0; i < lungime; i++) {
			rezultat += caractere.charAt(Math.floor(Math.random() * lungimeCaractere));
	}
	return rezultat;
}

export function convertesteInTimpLocal(e: DateValue, adauga: number = 3) {
	const data = e.toDate(getLocalTimeZone());
	data.setHours(data.getHours() + adauga);
	const stringTimpISO = data.toISOString();
	return stringTimpISO;
}

export function capitalizeazaPrimaLitera(str: string): string {
	if (str.length === 0) return str;
	const parti = str.split('-');
	return parti
			.map(part => capitalizeazaPrima(part))
			.join('-');
}

export function capitalizeazaPrima(str: string): string {
	if (str.length === 0) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeazaDupaLinie(str: string): string {
	const parti = str.split('-');
	return parti
			.map((part, index) => {
					if (index === 0) {
							return capitalizeazaPrimaLitera(part);
					} else if (part.length === 0) {
							return part;
					} else {
							return capitalizeazaPrimaLitera(part);
					}
			})
			.join('-');
}

export function dateleUltimeiLuniSiLunaAcuala() {
	const azi = new Date();
	const anulCurent = azi.getFullYear();
	const lunaCurenta = azi.getMonth() + 1;
	const dataDeInceput = new Date(anulCurent, lunaCurenta - 1, 1);
	const dataDeSfarsitUltima = new Date(anulCurent, lunaCurenta - 1, 0);
	const dataDeInceputUltima = new Date(anulCurent, lunaCurenta - 2, 1);
	return {inceput: dataDeInceput, sfarsit: azi, sfarsitUltima: dataDeSfarsitUltima, inceputUltima: dataDeInceputUltima}
}

export function dateleUltimeiZileSiZiuaAcuala() {
	const azi = new Date();
	const anulCurent = azi.getFullYear();
	const lunaCurenta = azi.getMonth() + 1;
	const dataDeInceput = new Date(anulCurent, lunaCurenta - 1, 1);
	const dataDeSfarsitUltima = new Date(anulCurent, lunaCurenta - 1, 0);
	const dataDeInceputUltima = new Date(anulCurent, lunaCurenta - 2, 1);
	return {inceput: dataDeInceput, sfarsit: azi, sfarsitUltima: dataDeSfarsitUltima, inceputUltima: dataDeInceputUltima}
}

export function dateleAnuluiTrecutSiAcual() {
	const azi = new Date();
	const anulCurent = azi.getFullYear();
	const lunaCurenta = azi.getMonth() + 1;
	const dataDeInceputAceastaLuna = new Date(anulCurent, lunaCurenta - 1, 1);
	const dataDeSfarsitAceastaLuna = new Date(anulCurent, lunaCurenta, 0);
	const dataDeInceputAnulTrecutAceastaLuna = new Date(anulCurent - 1, lunaCurenta - 1, 1);
	const dataDeSfarsitAnulTrecutAceastaLuna = new Date(anulCurent - 1, lunaCurenta, 0);
	return {
			inceput: dataDeInceputAceastaLuna,
			sfarsit: dataDeSfarsitAceastaLuna,
			inceputUltima: dataDeInceputAnulTrecutAceastaLuna,
			sfarsitUltima: dataDeSfarsitAnulTrecutAceastaLuna
	};
}

export const linkURL = (calea: string) => {
	let start = "";
	const numeCale = calea.split("/");
	if (numeCale.length <= 3) {
		start = "./";
	} else if (numeCale.length == 4) {
		start = "../";
	} else if (numeCale.length == 5) {
		start = "../../";
	} else if (numeCale.length == 6) {
		start = "../../../";
	} else {
		start = "../../../../";
	}
	return start + "dashboard/";
};

export const URLAcasa = (calea: string) => {
	const numeCale = calea.split("/");
	if (numeCale.length <= 3) {
		return "../../";
	} else if (numeCale.length == 4) {
		return "../../../";
	} else if (numeCale.length == 5) {
		return "../../../../";
	} else if (numeCale.length == 6) {
		return "../../../../../";
	} else {
		return "../../../../../../";
	}
};

export function esteNumeric(valoare: any) {
  if (typeof valoare === 'number') {
    return !isNaN(valoare);
  }
  if (typeof valoare === 'string') {
    valoare = valoare.trim();
    if (valoare === '') {
      return false;
    }
    return !isNaN(parseFloat(valoare)) && isFinite(valoare);
  }
  return false;
}

export function obtineNumarAleatoriu(max: number): number {
	return Math.floor(Math.random() * (max - 0 + 1)) + 0;
}

export function obtineElementAleatoriu<T>(array: T[]): T {
	const indexAleatoriu = Math.floor(Math.random() * array.length);
	return array[indexAleatoriu];
}

export const obtineSpecificatieAleatorie = (): boolean => Math.random() < 0.5;
