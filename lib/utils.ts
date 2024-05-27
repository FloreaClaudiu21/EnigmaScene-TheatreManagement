import { RaportModal } from "@/services/StateProvider";
import { getLocalTimeZone } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { Header } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FilterParams } from "./types";
import { FilterMap, TableFilterMap } from "@/components/admin/table/Table";
import { DateRange } from "react-day-picker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeString(str: string): string {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function startsWithIgnoringDiacritics(str: string, value: string): boolean {
	const normalizedStr = normalizeString(str);
	const normalizedPrefix = normalizeString(value);
	return normalizedStr.startsWith(normalizedPrefix);
}

type AnyObject = { [key: string]: any };

export function parseQueryParams(params: any, filters?: FilterMap[]): FilterParams[] {
	const queryParams: FilterParams[] = [];
	const allParams = new URLSearchParams(params);
	const excludedKeys = ["tab", "to", "from"];
	if (filters && filters.length > 0) {
		for (const [key, value] of allParams.entries()) {
			if (excludedKeys.includes(key)) continue;
			let text = key;
			const found = filters.filter((v) => v.column == key);
			if (found.length > 0) {
				text = found[0].label;
			}
			queryParams.push({ column: key, label: text, page: "", value: value });
		}
	} else {
		for (const [key, value] of allParams.entries()) {
			if (excludedKeys.includes(key)) continue;
			queryParams.push({ column: key, label: key.toUpperCase(), page: "", value: value });
		}
	}
	return queryParams;
}

export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const handlePredefinedDateChange = (period: string): DateRange | undefined => {
	let fromDate;
  const toDate = new Date();
	switch (period) {
		case 'today':
			fromDate = new Date();
			break;
		case 'lastDay':
			fromDate = new Date(toDate);
			fromDate.setDate(toDate.getDate() - 1);
			break;
		case 'last7Days':
			fromDate = new Date(toDate);
			fromDate.setDate(toDate.getDate() - 7);
			break;
		case 'last30Days':
			fromDate = new Date(toDate);
			fromDate.setDate(toDate.getDate() - 30);
			break;
		case 'last60Days':
			fromDate = new Date(toDate);
			fromDate.setDate(toDate.getDate() - 60);
			break;
		case 'last90Days':
			fromDate = new Date(toDate);
			fromDate.setDate(toDate.getDate() - 90);
			break;
		case 'last6Months':
			fromDate = new Date(toDate);
			fromDate.setMonth(toDate.getMonth() - 6);
			break;
		case 'last9Months':
			fromDate = new Date(toDate);
			fromDate.setMonth(toDate.getMonth() - 9);
			break;
		default:
			return;
	}
	return { from: fromDate, to: toDate };
};

export function deleteQueryParam(key: string, searchParams: any) {
	const allParams = new URLSearchParams(searchParams);
	allParams.delete(key);
	return allParams.toString();
}

export function setQueryParams(searchParams: any, filtersTable: TableFilterMap) {
	const params = new URLSearchParams(searchParams);
	filtersTable.filters.map((filter) => {
		if (!filter || !filter.column ||  filter.value.length <= 0) return;
		const currentValue = params.get(filter.column);
    if (currentValue === filter.value) {
      params.delete(filter.column);
    } else {
      params.set(filter.column, filter.value || '');
    }
	});
	params.set("from", formatDate(filtersTable.date?.from ?? new Date()));
	if (filtersTable.date?.to) {
		params.set("to", formatDate(filtersTable.date?.to));
	}
	return params.toString();
}

export function deleteQueryParams() {
	return "";
}

export function isDateValue(str: string) {
	if (isNumeric(str)) {
		return false;
	}
	const date = new Date(str);
	return !isNaN(date.getTime());
}

export function isDateString(str: string) {
	if (isNumeric(str)) {
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
	const parts = str.split("-");
  if (parts.length !== 3) {
    console.error("Invalid date format. Expected format: DD-MM-YYYY");
    return {
			check: false,
			date: null
		}
  }
	const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const year = parseInt(parts[2]);
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error("Invalid date components.");
    return {
			check: false,
			date: null
		}
  }
  const inputDate = new Date(year, month, day);
	return {
		check: true,
		date: inputDate
	};
}

export function isSameDay(currentDate: Date, dateString: string): boolean {
	const result = isDateString(dateString);
	if (!result.check) return false;
	const inputDate = result.date!;
	return (
		currentDate.getFullYear() === inputDate.getFullYear() &&
		currentDate.getMonth() === inputDate.getMonth() &&
		currentDate.getDate() === inputDate.getDate()
	);
}

export function findValueByKey(obj: AnyObject, key: string): any {
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }
  for (const k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      const result = findValueByKey(obj[k], key);
			if (result !== undefined && typeof result !== 'object') {
				return result;
			}
    }
  }
  return undefined;
}

export function filterListByKeysAndValues(arr: any[], searchParams: any): any[] {
	const filterCriteria = parseQueryParams(searchParams);
	if (filterCriteria.length <= 0) return arr;
	return arr.filter(item => {
		for (const filter of filterCriteria) {
			const value = filter.value;
			const column = filter.column;
			if (column === "tab" || column === "from" || column === "to") continue;
			const itemValue = findValueByKey(item, column);
			///////////////////////////////////////////////
			if (itemValue === undefined || itemValue == '') {
				return false;
			} else if (typeof itemValue === "number" && (!isNumeric(value) || parseInt(value) !== itemValue)) {
				return false;
			} else if (isDateValue(itemValue)) {
				return isSameDay(new Date(itemValue), value);
			} else if (typeof itemValue === "string" && !startsWithIgnoringDiacritics(itemValue, value)) {
				return false;
			}
		}
		return true;
	});
}

export function filterListByKeyValue(arr: any[], key: string, value: any): any[] {
	return arr.filter(item => {
		if (item[key] !== undefined) {
			return item[key] === value;
		}
		const findValueByKey = (obj: any, key: string): any => {
			if (obj.hasOwnProperty(key)) {
				return obj[key];
			}
			for (const k in obj) {
				if (obj[k] && typeof obj[k] === 'object') {
					const result = findValueByKey(obj[k], key);
					if (result !== undefined) {
						return result;
					}
				}
			}
			return undefined;
		};
		const itemValue = findValueByKey(item, key);
    if (itemValue !== undefined) {
      return startsWithIgnoringDiacritics(itemValue, value);
    }
    return false;
	});
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

export function isNumeric(value: any) {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (typeof value === 'string') {
    value = value.trim();
    if (value === '') {
      return false;
    }
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  return false;
}

export function getRandomNumber(max: number): number {
	return Math.floor(Math.random() * (max - 0 + 1)) + 0;
}

export function getRandomElement<T>(array: T[]): T {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

export const getRandomSpecification = (): boolean => Math.random() < 0.5;