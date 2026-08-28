import { NextResponse } from "next/server";
import { getStripeClient } from "../../../../../lib/stripe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const stripe = await getStripeClient();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    return NextResponse.json(session);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
