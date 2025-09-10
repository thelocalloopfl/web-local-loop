// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { fetchStripeConfig } from "@/lib/fetchStripeConfig";

// This is the endpoint Stripe will send events to.
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // 1. Get Stripe config from Sanity to find the correct webhook secret
    const config = await fetchStripeConfig();
    if (!config) {
      throw new Error("Stripe configuration not found in Sanity");
    }

    // Use the correct webhook secret based on sandbox mode
    const webhookSecret = config.enableSandbox
      ? process.env.STRIPE_WEBHOOK_SECRET_SANDBOX
      : process.env.STRIPE_WEBHOOK_SECRET_LIVE;

    if (!webhookSecret) {
      throw new Error(
        "Stripe Webhook Secret is not set in environment variables."
      );
    }
    
    // 2. Initialize Stripe with a secret key to access its API
    const secretKey = config.enableSandbox
      ? config.sandboxSecret
      : config.liveSecret;

    if (!secretKey) {
        throw new Error("Stripe Secret Key is missing in Sanity config");
    }
      
    const stripe = new Stripe(secretKey);


    // 3. Verify the event is genuinely from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 4. Handle the specific event type
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Payment successful for session ID:", session.id);
      
      // TODO: Fulfill the order
      // - Save the order details to your database
      // - Send a confirmation email to the customer
      // - Update inventory, etc.
      
      break;
    // You can handle other event types here
    // case 'payment_intent.succeeded':
    //   ...
    //   break;
    default:
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  // 5. Acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
