// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fetchStripeConfig } from "@/lib/fetchStripeConfig";

type CartItem = {
  name: string;
  price: number;
  qty: number;
};

export async function POST(req: Request) {
  try {
    const config = await fetchStripeConfig();
    if (!config) throw new Error("Stripe configuration not found in Sanity");

    const secretKey = config.enableSandbox ? config.sandboxSecret : config.liveSecret;
    if (!secretKey) throw new Error("Stripe Secret Key missing");

    const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

    const { cart } = (await req.json()) as { cart: CartItem[] };
    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Checkout Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
