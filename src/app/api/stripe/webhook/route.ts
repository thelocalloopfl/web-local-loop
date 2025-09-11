// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { fetchStripeConfig } from "@/lib/fetchStripeConfig";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) throw new Error("Missing Stripe signature");

    const config = await fetchStripeConfig();
    if (!config) throw new Error("Stripe config not found");

    const secretKey = config.enableSandbox ? config.sandboxSecret : config.liveSecret;
    const webhookSecret = config.enableSandbox
      ? process.env.STRIPE_WEBHOOK_SECRET_SANDBOX
      : process.env.STRIPE_WEBHOOK_SECRET_LIVE;

    if (!secretKey || !webhookSecret) throw new Error("Stripe secrets missing");

    const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

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
        console.log("✅ Payment successful:", event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        console.log("❌ Payment failed:", event.data.object);
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
