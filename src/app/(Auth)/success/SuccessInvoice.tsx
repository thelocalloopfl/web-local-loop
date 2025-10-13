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

  useEffect(() => {
    if (invoice) {
      clearCart();
    }
  }, [invoice?.id]);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${sessionId}`);
        const data = await res.json();
        if (data?.error) throw new Error(data.error);
        setInvoice(data as InvoiceSession);
        console.log("Loaded invoice:", data);
      } catch (err) {
        console.error("Failed to load invoice", err);
      }
    })();
  }, [sessionId]);

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-orange-700 animate-pulse">Loading invoice...</p>
      </div>
    );
  }

  const lineItems = invoice.line_items?.data ?? [];

  const taxAmount = invoice.total_details?.amount_tax ? invoice.total_details.amount_tax / 100 : 0;
  const subtotal = (invoice.amount_subtotal ?? 0) / 100;
  const total = (invoice.amount_total ?? 0) / 100;
  const shippingAmount = invoice.total_details?.amount_shipping ? invoice.total_details.amount_shipping / 100 : 0;
  const customerId = (invoice.customer as Stripe.Customer)?.id || invoice.customer;
  const openPortal = async () => {
  if (!customerId) {
    console.error("No customer ID found — cannot open portal");
    return;
  }

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
    <div className="main-content mx-auto px-5 py-16 text-black max-w-7xl flex flex-col items-center">
      {/* Success banner */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <MdOutlineVerified className="h-16 w-16 text-orange-700" />
        </div>
        <h2 className="text-4xl font-bold text-orange-700">Payment Successful!</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Thank you for your purchase.</p>
      </div>

      {/* Invoice box */}
      <div className="bg-gray-50 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl rounded-xl p-6 sm:p-8 text-sm">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold tracking-widest text-center text-orange-700">INVOICE</h1>
        </div>

        {/* Billing & Shipping Info */}
        <div className="mb-4 pt-4 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Bill To</h3>
            <p className="text-gray-800 text-sm sm:text-base">{invoice.customer_details?.name || "Customer"}</p>
            <p className="text-gray-500 text-xs sm:text-sm">{invoice.customer_details?.email}</p>
            {invoice.customer_details?.address && (
              <p className="text-gray-500 text-xs sm:text-sm">
                {invoice.customer_details.address.line1}<br/>
                {invoice.customer_details.address.line2 && <>{invoice.customer_details.address.line2}<br/></>}
                {invoice.customer_details.address.city}, {invoice.customer_details.address.state} {invoice.customer_details.address.postal_code}<br/>
                {invoice.customer_details.address.country}
              </p>
            )}
          </div>

          <div className="mt-1 text-xs sm:text-sm text-gray-600 space-y-1">
            <p><span className="font-semibold">Invoice #:</span> 0000{(invoice.id ?? "").slice(-4)}</p>
            <p><span className="font-semibold">Invoice Date:</span> {new Date((invoice.created ?? Date.now() / 1000) * 1000).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items table */}
        <div className="overflow-x-auto pt-4">
          <table className="w-full border-collapse mb-4 text-xs sm:text-sm">
            <thead>
              <tr className="bg-orange-100 text-orange-700 rounded-2xl">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-right">Unit Price</th>
                <th className="py-2 px-4 text-left">QTY</th>
                <th className="py-2 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr key={item.id || i} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{i + 1}</td>
                  <td className="py-2 px-4">{item.description}</td>
                  <td className="py-2 px-4 text-right">${((item.price?.unit_amount ?? 0) / 100).toFixed(2)}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4 text-right">${((item.amount_total ?? (item.price?.unit_amount ?? 0) * (item.quantity ?? 1)) / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-2/3 md:w-1/2">
            <div className="flex justify-between py-1 text-xs sm:text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {taxAmount > 0 && (
              <div className="flex justify-between py-1 text-xs sm:text-sm">
                <span>Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            {shippingAmount > 0 && (
              <div className="flex justify-between py-1 text-xs sm:text-sm">
                <span>Shipping</span>
                <span>${shippingAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 font-bold border-t mt-2 border-black text-orange-700 text-sm sm:text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to home */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-orange-700 text-white rounded-full shadow-md hover:bg-orange-800 transition-all"
        >
          <IoArrowBack className="text-lg" /> Back to Home
        </Link>

        <button
          onClick={openPortal}
          disabled={loading}
          className="ml-4 flex text-white cursor-pointer items-center gap-2 px-6 py-3 bg-orange-700 rounded-full shadow-md hover:bg-orange-800 transition-all disabled:opacity-50"
        >
          {loading ? "Loading..." : "Manage Subscription"}
        </button>
      </div>
    </div>
  );
}
