import {
	differenceInDays as diferentaInZile,
	differenceInMonths as diferentaInLuni,
	differenceInWeeks as diferentaInSaptamani,
	eachDayOfInterval as fiecareZiDinInterval,
	eachMonthOfInterval as fiecareLunaDinInterval,
	eachWeekOfInterval as fiecareSaptamanaDinInterval,
	eachYearOfInterval as fiecareAnDinInterval,
	endOfWeek as sfarsitDeSaptamana,
	interval as intervalDeDate,
	isValid as esteValid,
	max as maxim,
	min as minim,
	startOfDay as startDeZi,
	startOfWeek as startDeSaptamana,
	subDays as scadeZile,
} from "date-fns";
import { DateRange as IntervalDeDate } from "react-day-picker";

const FORMAT_DATA = new Intl.DateTimeFormat("ro", {
	dateStyle: "medium",
});

const FORMAT_DATA_COMPLET = new Intl.DateTimeFormat("ro", {
	dateStyle: "full",
	timeStyle: "long",
});

export function formateazaData(data: Date) {
	return FORMAT_DATA.format(data);
}

export function formateazaDataComplet(data: Date) {
	const dataString = FORMAT_DATA_COMPLET.format(data)
		.split("EEST")[0]
		.split("EET")[0];
	const parteOra = dataString.split(" la ")[1];
	const componenteOra = parteOra.split(":");
	const ora =
		dataString.split(" la ")[0] + ` la ${componenteOra[0]}:${componenteOra[1]}`;
	return ora;
}

const FORMAT_VALUTA = new Intl.NumberFormat("ro", {
	currency: "RON",
	style: "currency",
	minimumFractionDigits: 0,
});

export function formateazaValuta(cantitate: number) {
	return FORMAT_VALUTA.format(cantitate);
}

const FORMAT_NUMAR = new Intl.NumberFormat("ro");

export function formateazaNumar(numar: number) {
	return FORMAT_NUMAR.format(numar);
}

export const OPTIUNI_INTERVAL = {
	azi: {
		eticheta: "Astăzi",
		eticheta1: " astăzi.",
		dataInceput: startDeZi(new Date()),
		dataSfarsit: null,
	},
	ultima_zi: {
		eticheta: "O zi in urmă",
		eticheta1: " cu o zi in urmă.",
		dataInceput: startDeZi(scadeZile(new Date(), 1)),
		dataSfarsit: null,
	},
	ultimele_7_zile: {
		eticheta: "Ultimele 7 zile",
		eticheta1: " în ultimele 7 zile.",
		dataInceput: startDeZi(scadeZile(new Date(), 6)),
		dataSfarsit: null,
	},
	ultimele_30_zile: {
		eticheta: "Ultimele 30 zile",
		eticheta1: " în ultimele 30 de zile.",
		dataInceput: startDeZi(scadeZile(new Date(), 29)),
		dataSfarsit: null,
	},
	ultimele_90_zile: {
		eticheta: "Ultimele 90 zile",
		eticheta1: " în ultimele 90 de zile.",
		dataInceput: startDeZi(scadeZile(new Date(), 89)),
		dataSfarsit: null,
	},
	ultimele_365_zile: {
		eticheta: "Ultimele 365 zile",
		eticheta1: " în ultimele 365 de zile.",
		dataInceput: startDeZi(scadeZile(new Date(), 364)),
		dataSfarsit: null,
	},
	toate_timpul: {
		eticheta: "Toate zilele",
		eticheta1: " în toate zilele.",
		dataInceput: null,
		dataSfarsit: null,
	},
};

export function seteazaInterval(
	router: any,
	cale: string,
	parametriCautare: any,
	cheieInterogare: string,
	interval: keyof typeof OPTIUNI_INTERVAL | IntervalDeDate
) {
	const parametri = new URLSearchParams(parametriCautare);
	if (typeof interval === "string") {
		parametri.set(cheieInterogare, interval);
		parametri.delete(`${cheieInterogare}From`);
		parametri.delete(`${cheieInterogare}To`);
	} else {
		if (interval.from == null || interval.to == null) return;
		parametri.delete(cheieInterogare);
		parametri.set(`${cheieInterogare}From`, interval.from.toISOString());
		parametri.set(`${cheieInterogare}To`, interval.to.toISOString());
	}
	router.push(`${cale}?${parametri.toString()}`, { scroll: false });
}

export function obtineOptiuneInterval(
	parametriCautare: any,
	cheieInterogare: string
) {
	const interval = parametriCautare ? parametriCautare[cheieInterogare] : null;
	const sfarsit = parametriCautare
		? parametriCautare[cheieInterogare + "To"]
		: null;
	const inceput = parametriCautare
		? parametriCautare[cheieInterogare + "From"]
		: null;
	if (interval == null) {
		const dataSfarsit = new Date(sfarsit ?? "");
		const dataInceput = new Date(inceput ?? "");
		if (!esteValid(dataInceput) || !esteValid(dataSfarsit))
			return OPTIUNI_INTERVAL.azi;
		return {
			eticheta: `${formateazaData(dataInceput)} - ${formateazaData(
				dataSfarsit
			)}`,
			eticheta1: `în perioada ${formateazaData(dataInceput)} - ${formateazaData(
				dataSfarsit
			)}.`,
			dataInceput,
			dataSfarsit,
		};
	}
	return OPTIUNI_INTERVAL[interval as keyof typeof OPTIUNI_INTERVAL];
}

export function obtineArrayDateGrafic(
	dataInceput: Date,
	dataSfarsit: Date = new Date()
) {
	const zile = diferentaInZile(dataSfarsit, dataInceput);
	if (zile < 30) {
		return {
			array: fiecareZiDinInterval(intervalDeDate(dataInceput, dataSfarsit)),
			format: formateazaData,
		};
	}
	const saptamani = diferentaInSaptamani(dataSfarsit, dataInceput);
	if (saptamani < 30) {
		return {
			array: fiecareSaptamanaDinInterval(
				intervalDeDate(dataInceput, dataSfarsit)
			),
			format: (data: Date) => {
				const inceput = maxim([startDeSaptamana(data), dataInceput]);
				const sfarsit = minim([sfarsitDeSaptamana(data), dataSfarsit]);

				return `${formateazaData(inceput)} - ${formateazaData(sfarsit)}`;
			},
		};
	}
	const luni = diferentaInLuni(dataSfarsit, dataInceput);
	if (luni < 30) {
		return {
			array: fiecareLunaDinInterval(intervalDeDate(dataInceput, dataSfarsit)),
			format: new Intl.DateTimeFormat("ro", { month: "long", year: "numeric" })
				.format,
		};
	}
	return {
		array: fiecareAnDinInterval(intervalDeDate(dataInceput, dataSfarsit)),
		format: new Intl.DateTimeFormat("ro", { year: "numeric" }).format,
	};
}
