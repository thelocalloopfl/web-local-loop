import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import nodemailer from "nodemailer";
import { getStripeContext } from "../../../../../lib/stripe";
import { invoiceEmailTemplate } from "../../../../../lib/stripeEmailTemplates";

type InvoiceItem = {
  name: string;
  qty: number;
  price: number;
};

type InvoiceEmailData = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  totalAmount: number;
  currency: string;
  items: InvoiceItem[];
};

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) throw new Error("Missing Stripe signature");

    // Stripe client + sandbox flag come from server-only environment config.
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
      // Successful checkout (immediate or delayed async payment) -> send invoice emails.
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        console.log("Checkout payment successful:", event.data.object);

        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          { expand: ["line_items"] }
        );

        await sendInvoiceEmails(invoiceDataFromSession(session));
        break;
      }

      // Paid invoice (subscriptions / manually issued invoices) -> send invoice emails.
      case "invoice.paid": {
        console.log("Invoice paid:", event.data.object);

        const invoice = event.data.object as Stripe.Invoice;
        await sendInvoiceEmails(await invoiceDataFromInvoice(stripe, invoice));
        break;
      }

      // Delayed async payment failed -> log only.
      case "checkout.session.async_payment_failed":
        console.error("Async checkout payment failed:", event.data.object);
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

function invoiceDataFromSession(session: Stripe.Checkout.Session): InvoiceEmailData {
  const items: InvoiceItem[] = (session.line_items?.data ?? []).map((lineItem) => ({
    name: lineItem.description ?? "Product",
    qty: lineItem.quantity ?? 1,
    price: (lineItem.amount_total ?? 0) / 100,
  }));

  return {
    id: session.id,
    customerName: session.customer_details?.name ?? "Customer",
    customerEmail: session.customer_details?.email ?? null,
    totalAmount: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? "usd").toUpperCase(),
    items,
  };
}

async function invoiceDataFromInvoice(
  stripe: Stripe,
  invoice: Stripe.Invoice
): Promise<InvoiceEmailData> {
  let customer: Stripe.Customer | null = null;
  if (invoice.customer) {
    const customerId =
      typeof invoice.customer === "string" ? invoice.customer : invoice.customer.id;
    const retrieved = await stripe.customers.retrieve(customerId);
    if (!("deleted" in retrieved)) customer = retrieved;
  }

  const items: InvoiceItem[] = invoice.lines.data.map((line) => ({
    name: line.description ?? "Product",
    qty: line.quantity ?? 1,
    price: line.amount / 100,
  }));

  return {
    id: invoice.id ?? "",
    customerName: customer?.name ?? "Customer",
    customerEmail: customer?.email ?? null,
    totalAmount: invoice.amount_paid / 100,
    currency: invoice.currency.toUpperCase(),
    items,
  };
}

async function sendInvoiceEmails(data: InvoiceEmailData) {
  if (!data.customerEmail || data.items.length === 0) return;

  const html = invoiceEmailTemplate(
    data.customerName,
    data.customerEmail,
    data.id,
    data.items,
    data.totalAmount,
    data.currency
  );

  await sendEmail(data.customerEmail, "Your Payment Receipt / Invoice", html);

  const adminEmail = process.env.SMTP_USER;
  if (adminEmail) {
    await sendEmail(adminEmail, "New Payment Received", html);
  }
}

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"The Local Loop FL" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
