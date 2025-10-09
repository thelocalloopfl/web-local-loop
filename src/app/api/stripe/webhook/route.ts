import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { fetchStripeConfig } from "@/lib/fetchStripeConfig";
import { invoiceEmailTemplate } from "../../../../../lib/stripeEmailTemplates";
import nodemailer from "nodemailer";

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

    // ✅ Only trigger for successful payments
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      console.log("✅ Payment successful:", event.data.object);

      const session = await stripe.checkout.sessions.retrieve(
        (event.data.object as Stripe.Checkout.Session).id,
        { expand: ["line_items"] }
      );

      await sendInvoiceEmails(session);
    }

    if (event.type === "checkout.session.async_payment_failed") {
      console.log("❌ Payment failed:", event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook Error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

async function sendInvoiceEmails(session: Stripe.Checkout.Session) {
  if (!session.line_items?.data || !session.customer_details?.email) return;

  const items = session.line_items.data.map((item) => ({
    name: item.description || "Product",
    qty: item.quantity || 1,
    price: ((item.amount_total ?? 0) / 100) || 0,
  }));

  const totalAmount = (session.amount_total ?? 0) / 100;
  const currency = session.currency?.toUpperCase() || "USD";

  const html = invoiceEmailTemplate(
    session.customer_details.name || "Customer",
    session.customer_details.email,
    session.id,
    items,
    totalAmount,
    currency
  );

  await sendEmail(session.customer_details.email, "Your Payment Receipt / Invoice", html);
  await sendEmail(process.env.SMTP_USER!, "New Payment Received", html);
}

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"The Local Loop FL" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
