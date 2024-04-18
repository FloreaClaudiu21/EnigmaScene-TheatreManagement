import "server-only";
import type { Locale } from "@/i18n.config";
import { LanguageData } from "./types";
const dictionaries = {
	en: () => import("@/locales/en.json").then((module) => module.default),
	ro: () => import("@/locales/ro.json").then((module) => module.default),
};
export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export const generateDictionary = async (params: any) => {
	const dict = await getDictionary(params.lang);
	const languageData = {
		dictionary: dict,
		language: params.lang,
	} as LanguageData;
	return languageData;
};
