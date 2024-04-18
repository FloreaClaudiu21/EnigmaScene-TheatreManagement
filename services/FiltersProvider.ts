"use client";
import { SelectedFilters } from "@/lib/types";
import { useCarsRefresh, useFiltersQuery } from "./StateProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { ZodObject, ZodTypeAny, z } from "zod";

export const getBaseURL = () => {
	const currentURL = window.location.href;
	const urlObject = new URL(currentURL);
	const baseURL = `${urlObject.protocol}//${urlObject.host}`;
	return baseURL;
};

export function inferSchemaType<T>(schema: z.ZodType<T, any, any>): T {
	return schema.parse({} as T);
}

export function createMapFromZodObject<T extends ZodObject<any, any, any>>(
	zodObject: T
) {
	const propertyMap: Record<string, ZodTypeAny> = {};
	Object.keys(zodObject.shape).map((key) => {
		propertyMap[key] = zodObject.shape[key];
	});
	const mapped = Object.entries(propertyMap).map(
		([propertyName, propertyType]) => ({
			propertyName,
			propertyType,
		})
	);
	return mapped;
}

export const useFiltersHook = () => {
	const router = useRouter();
	const pathName = usePathname();
	const query = useSearchParams();
	const useRefresh = useCarsRefresh();
	const useFilterQuery = useFiltersQuery();
	const selectedFilters = useFilterQuery.filters;
	///////////////////////////////////////////////
	const removeFilter = (
		filterType: keyof SelectedFilters,
		filterValue: string | null | undefined
	) => {
		if (!filterValue) return;
		let val: string | string[] | undefined = filterValue;
		const currentFilters = useFilterQuery.filters;
		if (Array.isArray(currentFilters[filterType])) {
			const updated = [...(currentFilters[filterType] as string[])];
			if (updated.includes(filterValue)) {
				updated.splice(updated.indexOf(filterValue), 1);
			}
			val = updated;
		} else if (typeof currentFilters[filterType] === "string") {
			if (currentFilters[filterType] === val) {
				val = undefined;
			}
		}
		useFilterQuery.setFilters({
			...currentFilters,
			[filterType]: val,
		} as SelectedFilters);
		selectedFilters.page = 1;
		setCookie(
			"filters",
			JSON.stringify({ ...currentFilters, [filterType]: val })
		);
		updateURL({ ...currentFilters, [filterType]: val });
	};
	const clearAllFilters = () => {
		const emptyFilters = useFilterQuery.clearFilters();
		setCookie("filters", JSON.stringify(emptyFilters));
		updateURL(emptyFilters);
	};
	const listSplitFromQuery = (key: string) => {
		const list = query.get(key);
		if (!list) return [];
		return list.includes("&") ? list.split("&") : [list];
	};
	const updatePage = (page: number) => {
		const prevFilters = useFilterQuery.filters;
		useFilterQuery.setFilters({
			...prevFilters,
			page: page,
		} as SelectedFilters);
		window.scrollTo({
			top: 0,
		});
		setCookie("filters", JSON.stringify({ ...selectedFilters, page: page }));
		updateURL({ ...selectedFilters, page: page });
	};
	const updateStateFromURL = () => {
		const filters: SelectedFilters = {
			page: parseInt(query.get("page") ?? "1") || 1,
			doors: query.get("doors"),
			seats: query.get("seats"),
			ratings: query.get("ratings"),
			specs: listSplitFromQuery("specs"),
			models: listSplitFromQuery("models"),
			fuelTypes: listSplitFromQuery("fuelTypes"),
			categories: listSplitFromQuery("categories"),
			fuelPolicy: listSplitFromQuery("fuelPolicy"),
			locationType: listSplitFromQuery("locationType"),
			manufacturers: listSplitFromQuery("manufacturers"),
			transmissions: listSplitFromQuery("transmissions"),
		};
		useFilterQuery.setFilters(filters);
		if (query.get("page") == null) {
			updatePage(1);
		}
		setCookie("filters", JSON.stringify(filters));
	};
	const handleFilterChangeMultiple = (
		filterType: keyof SelectedFilters,
		arrayTypes: string[]
	) => {
		const prevFilters = useFilterQuery.filters;
		useFilterQuery.setFilters({
			...prevFilters,
			[filterType]: arrayTypes,
		} as SelectedFilters);
		selectedFilters.page = 1;
		setCookie(
			"filters",
			JSON.stringify({ ...selectedFilters, [filterType]: arrayTypes })
		);
		updateURL({ ...selectedFilters, [filterType]: arrayTypes });
	};
	const handleFilterChange = (
		filterType: keyof SelectedFilters,
		filterValue: string
	) => {
		let val: string | string[] | undefined = filterValue;
		if (Array.isArray(selectedFilters[filterType])) {
			const updated = [...(selectedFilters[filterType] as string[])];
			if (updated.includes(filterValue)) {
				updated.splice(updated.indexOf(filterValue), 1);
			} else {
				updated.push(filterValue);
			}
			val = updated;
		} else {
			if (selectedFilters[filterType] === val) {
				val = undefined;
			} else if (filterValue == "none") {
				val = undefined;
			}
		}
		const prevFilters = useFilterQuery.filters;
		useFilterQuery.setFilters({
			...prevFilters,
			[filterType]: val,
		} as SelectedFilters);
		selectedFilters.page = 1;
		setCookie(
			"filters",
			JSON.stringify({ ...selectedFilters, [filterType]: val })
		);
		updateURL({ ...selectedFilters, [filterType]: val });
	};
	const handleFilterChangeOtherPage = (
		filterType: keyof SelectedFilters,
		filterValue: string
	) => {
		let val: string | string[] | undefined = filterValue;
		if (Array.isArray(selectedFilters[filterType])) {
			const updated = [...(selectedFilters[filterType] as string[])];
			if (updated.includes(filterValue)) {
				updated.splice(updated.indexOf(filterValue), 1);
			} else {
				updated.push(filterValue);
			}
			val = updated;
		} else {
			if (selectedFilters[filterType] === val) {
				val = undefined;
			}
		}
		const prevFilters = useFilterQuery.filters;
		useFilterQuery.setFilters({
			...prevFilters,
			[filterType]: val,
		} as SelectedFilters);
		selectedFilters.page = 1;
		setCookie(
			"filters",
			JSON.stringify({ ...selectedFilters, [filterType]: val })
		);
	};
	const updateURL = (filters: SelectedFilters) => {
		const queryParams = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (typeof value === "number") {
				queryParams.append("page", value.toString());
			} else if (!Array.isArray(value)) {
				if (value !== undefined && value != null) {
					queryParams.append(key, value as string);
				}
			} else {
				if (value.length > 0) {
					const arrayString = value.join("&");
					queryParams.append(key, arrayString);
				}
			}
		});
		useRefresh.setLoading(true);
		router.push(pathName + "?" + queryParams.toString(), { scroll: false });
		router.refresh();
	};
	return {
		selectedFilters,
		removeFilter,
		updateStateFromURL,
		clearAllFilters,
		listSplitFromQuery,
		handleFilterChange,
		handleFilterChangeOtherPage,
		handleFilterChangeMultiple,
		updateURL,
		updatePage,
	};
};
