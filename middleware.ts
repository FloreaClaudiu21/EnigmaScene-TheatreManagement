import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n.config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
	const negotiatorHeaders: Record<string, string> = {};
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
	const locales = i18n.locales;
	const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
	const locale = matchLocale(languages, locales, i18n.defaultLocale);
	return locale;
}

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const pathnameIsMissingLocale = i18n.locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
	);
	if (pathnameIsMissingLocale) {
		const locale = getLocale(request);
		const location = `/${locale}${pathname.startsWith("/") ? "" : "/"}/home`;
		return NextResponse.redirect(new URL(location, request.url));
	}
}

export const config = {
	matcher: ["/((?!api|images|_next/static|/_next/image|favicon.ico).*)"],
};