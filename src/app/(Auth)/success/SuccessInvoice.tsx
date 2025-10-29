"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MdOutlineVerified } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useCart } from "../../components/Context/Context";
import type Stripe from "stripe";
import Link from "next/link";

type InvoiceSession = Stripe.Checkout.Session & {
  line_items?: { data: Stripe.LineItem[] };
};

export default function SuccessInvoice() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [invoice, setInvoice] = useState<InvoiceSession | null>(null);
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // 🧹 Clear cart after success
  useEffect(() => {
    if (invoice) clearCart();
  }, [invoice?.id]);

  // 📦 Fetch invoice from backend
  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${sessionId}`);
        const data = await res.json();
        if (data?.error) throw new Error(data.error);
        setInvoice(data as InvoiceSession);
      } catch (err) {
        console.error("Failed to load invoice", err);
      }
    })();
  }, [sessionId]);

  // 💬 Loading State
  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--main-orange)] animate-pulse transition-colors">
        Loading invoice...
      </div>
    );
  }

  const lineItems = invoice.line_items?.data ?? [];
  const taxAmount = invoice.total_details?.amount_tax
    ? invoice.total_details.amount_tax / 100
    : 0;
  const subtotal = (invoice.amount_subtotal ?? 0) / 100;
  const total = (invoice.amount_total ?? 0) / 100;
  const shippingAmount = invoice.total_details?.amount_shipping
    ? invoice.total_details.amount_shipping / 100
    : 0;

  const customerId =
    (invoice.customer as Stripe.Customer)?.id || invoice.customer;

  // ⚙️ Customer Portal Redirect
  const openPortal = async () => {
    if (!customerId) return console.error("No customer ID found");
    setLoading(true);

    const res = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });

    if (!res.ok) {
      console.error(await res.text());
      setLoading(false);
      return;
    }

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    setLoading(false);
  };

  return (
    <div className="main-content mx-auto px-5 py-16 max-w-7xl flex flex-col items-center bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* ✅ Success Banner */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <MdOutlineVerified className="h-16 w-16 text-[var(--main-orange)]" />
        </div>
        <h2 className="text-4xl font-bold text-[var(--main-orange)]">Payment Successful!</h2>
        <p className="mt-2 max-w-2xl mx-auto text-[var(--foreground)]/70">
          Thank you for your purchase.
        </p>
      </div>

      {/* ✅ Invoice Box */}
      <div className="w-full max-w-2xl rounded-xl shadow-lg border border-[var(--footer-border)] bg-[var(--background)] transition-colors p-8">
        {/* Header */}
        <div className="border-b border-[var(--footer-border)] pb-4 mb-4 text-center">
          <h1 className="text-2xl font-bold tracking-widest text-[var(--main-orange)]">
            INVOICE
          </h1>
        </div>

        {/* Billing Info */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]/80">Bill To</h3>
            <p>{invoice.customer_details?.name || "Customer"}</p>
            <p className="text-sm text-[var(--foreground)]/60">
              {invoice.customer_details?.email}
            </p>
          </div>

          <div className="text-sm text-[var(--foreground)]/70 space-y-1">
            <p>
              <span className="font-semibold">Invoice #:</span>{" "}
              0000{(invoice.id ?? "").slice(-4)}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(
                (invoice.created ?? Date.now() / 1000) * 1000
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[color-mix(in srgb, var(--main-orange) 10%, transparent)] text-[var(--main-orange)]">
                <th className="py-2 px-3 text-left">#</th>
                <th className="py-2 px-3 text-left">Item</th>
                <th className="py-2 px-3 text-right">Unit</th>
                <th className="py-2 px-3 text-center">Qty</th>
                <th className="py-2 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr
                  key={item.id || i}
                  className="border-b border-[var(--footer-border)] hover:bg-[var(--footer-bg)] transition-colors"
                >
                  <td className="py-2 px-3">{i + 1}</td>
                  <td className="py-2 px-3">{item.description}</td>
                  <td className="py-2 px-3 text-right">
                    ${((item.price?.unit_amount ?? 0) / 100).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-center">{item.quantity}</td>
                  <td className="py-2 px-3 text-right">
                    ${(
                      (item.amount_total ??
                        (item.price?.unit_amount ?? 0) * (item.quantity ?? 1)) /
                      100
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 flex justify-end text-sm">
          <div className="w-full sm:w-2/3 md:w-1/2 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            {shippingAmount > 0 && (
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-[var(--footer-border)] pt-2 font-semibold text-[var(--main-orange)]">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="
            flex items-center gap-2 px-6 py-3 
            bg-[var(--main-orange)] hover:opacity-90 
            text-white rounded-full shadow transition
          "
        >
          <IoArrowBack /> Back to Home
        </Link>

        <button
          onClick={openPortal}
          disabled={loading}
          className="
            flex items-center gap-2 px-6 py-3 
            bg-[var(--main-orange)] hover:opacity-90 
            text-white rounded-full shadow transition
            disabled:opacity-50
          "
        >
          {loading ? "Loading..." : "Manage Subscription"}
        </button>
      </div>
    </div>
  );
}
