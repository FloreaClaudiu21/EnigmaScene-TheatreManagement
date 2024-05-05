import { RaportModal } from "@/services/StateProvider";
import { getLocalTimeZone } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { Header } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validRowsAndCols(raportModal: RaportModal) {
	const dataRows = raportModal.raport?.getCoreRowModel().rows;
	const dataColumns = raportModal.raport
		?.getHeaderGroups()[0]
		.headers.filter(
			(header) =>
				header.column.getIsVisible() &&
				header.column.id != "select" &&
				header.column.id != "actions" && header.column.id != "photo"
		);
	const validColums: Header<any, unknown>[] = [];
	dataColumns?.map((col) => {
		dataRows?.map((row) => {
			const value = row.original[col.id];
			const type = typeof value;
			const isDate = value instanceof Date;
			if (
				value != undefined &&
				(type == "number" || type == "string" || isDate || type == "boolean")
			) {
				if (!validColums.includes(col)) {
					validColums.push(col);
				}
			}
		});
	});
	return {cols: validColums, rows: dataRows ?? []}
}

export function generateRandomString(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export function convertToLocalTime(e: DateValue, add: number = 3) {
	const date = e.toDate(getLocalTimeZone());
	date.setHours(date.getHours() + add);
	const isonTimeString = date.toISOString();
	return isonTimeString;
}

export function capitalizeFirstLetter(str: string): string {
	if (str.length === 0) return str;
	const parts = str.split('-');
	return parts
			.map(part => capitalizeFirst(part))
			.join('-');
}

export function capitalizeFirst(str: string): string {
	if (str.length === 0) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeAfterHyphen(str: string): string {
	const parts = str.split('-');
	return parts
			.map((part, index) => {
					if (index === 0) {
							return capitalizeFirstLetter(part);
					} else if (part.length === 0) {
							return part;
					} else {
							return capitalizeFirstLetter(part);
					}
			})
			.join('-');
}

export function lastMonthAndThisMonthDates() {
	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth() + 1;
	const startDate = new Date(currentYear, currentMonth - 1, 1);
	const endDateLast = new Date(currentYear, currentMonth - 1, 0);
	const startDateLast = new Date(currentYear, currentMonth - 2, 1);
	return {start: startDate, end: today, endLast: endDateLast, startLast: startDateLast}
}

export function lastDayAndThisDayDates() {
	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth() + 1;
	const startDate = new Date(currentYear, currentMonth - 1, 1);
	const endDateLast = new Date(currentYear, currentMonth - 1, 0);
	const startDateLast = new Date(currentYear, currentMonth - 2, 1);
	return {start: startDate, end: today, endLast: endDateLast, startLast: startDateLast}
}

export function lastYearAndThisYearDates() {
	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth() + 1;
	const startDateThisMonth = new Date(currentYear, currentMonth - 1, 1);
	const endDateThisMonth = new Date(currentYear, currentMonth, 0);
	const startDateLastYearThisMonth = new Date(currentYear - 1, currentMonth - 1, 1);
	const endDateLastYearThisMonth = new Date(currentYear - 1, currentMonth, 0);
	return {
			start: startDateThisMonth,
			end: endDateThisMonth,
			startLast: startDateLastYearThisMonth,
			endLast: endDateLastYearThisMonth
	};
}

export const urlLink = (pathname: string) => {
	let start = "";
	const pathNames = pathname.split("/");
	if (pathNames.length <= 3) {
		start = "./";
	} else if (pathNames.length == 4) {
		start = "../";
	} else if (pathNames.length == 5) {
		start = "../../";
	} else if (pathNames.length == 6) {
		start = "../../../";
	} else {
		start = "../../../../";
	}
	return start + "dashboard/";
};

export const homeUrl = (pathname: string) => {
	const pathNames = pathname.split("/");
	if (pathNames.length <= 3) {
		return "../../";
	} else if (pathNames.length == 4) {
		return "../../../";
	} else if (pathNames.length == 5) {
		return "../../../../";
	} else if (pathNames.length == 6) {
		return "../../../../../";
	} else {
		return "../../../../../../";
	}
};

export function isNumeric(num: any){
  return !isNaN(num)
}

export function getRandomNumber(max: number): number {
	return Math.floor(Math.random() * (max - 0 + 1)) + 0;
}

export function getRandomElement<T>(array: T[]): T {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

export const getRandomSpecification = (): boolean => Math.random() < 0.5;