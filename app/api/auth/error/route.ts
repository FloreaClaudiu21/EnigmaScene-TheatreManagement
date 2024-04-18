import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const signInParams = getCookie("signInProviderLinkParams", { cookies });
	if (signInParams) {
		return NextResponse.redirect(
			process.env.APP_URL + "/en/account/provider-linked"
		);
	}
	return NextResponse.redirect(process.env.APP_URL + "");
}
