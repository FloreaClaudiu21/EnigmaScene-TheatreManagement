import { runCronJob } from "@/jobs/fetchExchangeRates";
import { NextResponse } from "next/server";

export async function GET() {
	await runCronJob();
	return NextResponse.json({ ok: true });
}
