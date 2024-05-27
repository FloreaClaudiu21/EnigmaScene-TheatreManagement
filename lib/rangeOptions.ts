import {
	differenceInDays,
	differenceInMonths,
	differenceInWeeks,
	eachDayOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	eachYearOfInterval,
	endOfWeek,
	interval,
	isValid,
	max,
	min,
	startOfDay,
	startOfWeek,
	subDays,
} from "date-fns";
import { DateRange } from "react-day-picker";

const DATE_FORMATTER = new Intl.DateTimeFormat("ro", {
	dateStyle: "medium",
});

const DATE_FORMATTER_FULL = new Intl.DateTimeFormat("ro", {
	dateStyle: "full",
	timeStyle: "long",
});

export function formatDate(date: Date) {
	return DATE_FORMATTER.format(date);
}

export function formatDateFull(date: Date) {
	const dateString = DATE_FORMATTER_FULL.format(date)
		.split("EEST")[0]
		.split("EET")[0];
	const timePart = dateString.split(" la ")[1];
	const timeComponents = timePart.split(":");
	const time =
		dateString.split(" la ")[0] +
		` la ${timeComponents[0]}:${timeComponents[1]}`;
	return time;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("ro", {
	currency: "RON",
	style: "currency",
	minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
	return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("ro");

export function formatNumber(number: number) {
	return NUMBER_FORMATTER.format(number);
}

export const RANGE_OPTIONS = {
	today: {
		label: "Astăzi",
		label1: " astăzi.",
		startDate: startOfDay(new Date()),
		endDate: null,
	},
	last_day: {
		label: "O zi in urmă",
		label1: " cu o zi in urmă.",
		startDate: startOfDay(subDays(new Date(), 1)),
		endDate: null,
	},
	last_7_days: {
		label: "Ultimele 7 zile",
		label1: " în ultimele 7 zile.",
		startDate: startOfDay(subDays(new Date(), 6)),
		endDate: null,
	},
	last_30_days: {
		label: "Ultimele 30 zile",
		label1: " în ultimele 30 de zile.",
		startDate: startOfDay(subDays(new Date(), 29)),
		endDate: null,
	},
	last_90_days: {
		label: "Ultimele 90 zile",
		label1: " în ultimele 90 de zile.",
		startDate: startOfDay(subDays(new Date(), 89)),
		endDate: null,
	},
	last_365_days: {
		label: "Ultimele 365 zile",
		label1: " în ultimele 365 de zile.",
		startDate: startOfDay(subDays(new Date(), 364)),
		endDate: null,
	},
	all_time: {
		label: "Toate zilele",
		label1: " în toate zilele.",
		startDate: null,
		endDate: null,
	},
};

export function setRange(
	router: any,
	pathname: string,
	searchParams: any,
	queryKey: string,
	range: keyof typeof RANGE_OPTIONS | DateRange
) {
	const params = new URLSearchParams(searchParams);
	if (typeof range === "string") {
		params.set(queryKey, range);
		params.delete(`${queryKey}From`);
		params.delete(`${queryKey}To`);
	} else {
		if (range.from == null || range.to == null) return;
		params.delete(queryKey);
		params.set(`${queryKey}From`, range.from.toISOString());
		params.set(`${queryKey}To`, range.to.toISOString());
	}
	router.push(`${pathname}?${params.toString()}`, { scroll: false });
}

export function getRangeOption(searchParams: any, queryKey: string) {
	const range = searchParams ? searchParams[queryKey] : null;
	const to = searchParams ? searchParams[queryKey + "To"] : null;
	const from = searchParams ? searchParams[queryKey + "From"] : null;
	if (range == null) {
		const endDate = new Date(to ?? "");
		const startDate = new Date(from ?? "");
		if (!isValid(startDate) || !isValid(endDate)) return RANGE_OPTIONS.today;
		return {
			label: `${formatDate(startDate)} - ${formatDate(endDate)}`,
			label1: `în perioada ${formatDate(startDate)} - ${formatDate(endDate)}.`,
			startDate,
			endDate,
		};
	}
	return RANGE_OPTIONS[range as keyof typeof RANGE_OPTIONS];
}

export function getChartDateArray(startDate: Date, endDate: Date = new Date()) {
	const days = differenceInDays(endDate, startDate);
	if (days < 30) {
		return {
			array: eachDayOfInterval(interval(startDate, endDate)),
			format: formatDate,
		};
	}
	const weeks = differenceInWeeks(endDate, startDate);
	if (weeks < 30) {
		return {
			array: eachWeekOfInterval(interval(startDate, endDate)),
			format: (date: Date) => {
				const start = max([startOfWeek(date), startDate]);
				const end = min([endOfWeek(date), endDate]);

				return `${formatDate(start)} - ${formatDate(end)}`;
			},
		};
	}
	const months = differenceInMonths(endDate, startDate);
	if (months < 30) {
		return {
			array: eachMonthOfInterval(interval(startDate, endDate)),
			format: new Intl.DateTimeFormat("ro", { month: "long", year: "numeric" })
				.format,
		};
	}
	return {
		array: eachYearOfInterval(interval(startDate, endDate)),
		format: new Intl.DateTimeFormat("ro", { year: "numeric" }).format,
	};
}
