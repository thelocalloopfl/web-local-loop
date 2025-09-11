// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { fetchStripeConfig } from "@/lib/fetchStripeConfig";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      throw new Error("Missing Stripe signature");
    }

    // Get Stripe config from Sanity
    const config = await fetchStripeConfig();
    if (!config) throw new Error("Stripe configuration not found in Sanity");

    const secretKey = config.enableSandbox
      ? config.sandboxSecret
      : config.liveSecret;

    const webhookSecret = config.enableSandbox
      ? process.env.STRIPE_WEBHOOK_SECRET_SANDBOX!
      : process.env.STRIPE_WEBHOOK_SECRET_LIVE!;

    if (!secretKey || !webhookSecret) {
      throw new Error("Stripe secret key or webhook secret is missing");
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        console.log("✅ Payment successful:", event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        console.log("❌ Payment failed:", event.data.object);
        break;
      case "checkout.session.expired":
        console.log("⚠️ Checkout session expired:", event.data.object);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook Error: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
