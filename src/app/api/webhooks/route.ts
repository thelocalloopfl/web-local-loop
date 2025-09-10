import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fetchStripeConfig } from "@/lib/fetchStripeConfig";

export async function POST(req: Request) {
  const config = await fetchStripeConfig();

  if (!config) {
    throw new Error("Stripe configuration not found in Sanity");
  }

  const secretKey = config.enableSandbox
    ? config.sandboxSecret
    : config.liveSecret;

  if (!secretKey) {
    throw new Error("Stripe Secret Key is missing in Sanity config");
  }

  const stripe = new Stripe(secretKey);

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature"); // ✅ await here

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, signingSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Invalid signature: ${err.message}` },
        { status: 400 }
      );
    }
    console.error("❌ Unknown webhook error:", err);
    return NextResponse.json(
      { error: "Unknown webhook error" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Payment successful:", session.id);
        // TODO: mark order as paid in DB
        break;
      }
      case "invoice.paid": {
        console.log("📄 Invoice paid");
        break;
      }
      case "payment_intent.canceled": {
        console.log("⚠️ Payment canceled");
        break;
      }
      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Webhook handler failed:", err.message);
    } else {
      console.error("Webhook handler failed with unknown error:", err);
    }
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}