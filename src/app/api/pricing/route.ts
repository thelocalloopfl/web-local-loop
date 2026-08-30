import { NextResponse } from "next/server";
import { getStripeClient } from "../../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const { plan, priceId } = await req.json();

    if (!plan || !priceId) {
      return NextResponse.json({ error: "Missing plan or priceId" }, { status: 400 });
    }

    const stripe = await getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
