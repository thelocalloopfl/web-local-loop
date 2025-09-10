// app/api/checkout/session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fetchStripeConfig } from "@/lib/fetchStripeConfig";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // ✅ Fetch keys from Sanity
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

    // ✅ Init Stripe
    const stripe = new Stripe(secretKey, {
        apiVersion: "2025-07-30.basil",
    });

    // ✅ Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    return NextResponse.json(session);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe Session Fetch Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
