import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	typescript: true,
});

export async function POST(req: NextRequest) {
	const data = await req.json();
	const { currency, amount } = data;
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			currency,
			amount: Math.round(parseFloat(amount) * 100),
		});
		return new NextResponse(
			JSON.stringify({ token: paymentIntent.client_secret }),
			{ status: 200 }
		);
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: { message: error } }), {
			status: 400,
		});
	}
}
