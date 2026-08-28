import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripeContext } from "../../../../../lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) throw new Error("Missing Stripe signature");

    const { stripe, enableSandbox } = await getStripeContext();

    const webhookSecret = enableSandbox
      ? process.env.STRIPE_WEBHOOK_SECRET_SANDBOX
      : process.env.STRIPE_WEBHOOK_SECRET_LIVE;

    if (!webhookSecret) throw new Error("Missing Stripe webhook secret environment variable");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Webhook signature failed:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        console.log("Payment successful:", event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        console.log("Payment failed:", event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook Error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
