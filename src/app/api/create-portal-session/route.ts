import { NextResponse } from "next/server";
import { getStripeClient } from "../../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json({ error: "Invalid customerId" }, { status: 400 });
    }

    const stripe = await getStripeClient();

    const returnUrl = `${process.env.NEXT_PUBLIC_URL}/home`;

    console.log("Return URL:", returnUrl);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating portal session:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
