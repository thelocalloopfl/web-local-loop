"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../components/Context/Context";
import Toast from "./MessageTost";
import { FiShoppingCart } from "react-icons/fi";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { fetchStripeConfig, StripeConfig } from "@/lib/fetchStripeConfig";

type ToastType = { id: number; message: string; type: string };

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [mounted, setMounted] = useState(false);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const config: StripeConfig | null = await fetchStripeConfig();
        if (!config) {
          showToast("Stripe configuration not found.", "error");
          return;
        }

        const publishableKey = config.enableSandbox
          ? config.sandboxKey
          : config.liveKey;

        if (!publishableKey) {
          showToast("Stripe publishable key missing.", "error");
          return;
        }

        setStripePromise(loadStripe(publishableKey));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        showToast(`Failed to load Stripe config: ${message}`, "error");
      }
    }
    init();
    setMounted(true);
  }, []);

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  if (!mounted) {
    return (
      <div className="main-content mx-auto px-5 py-13 text-black min-h-screen flex items-center justify-center">
        <p className="text-orange-700">Loading cart...</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      if (cart.length === 0) {
        showToast("Your cart is empty.", "error");
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (!data.sessionId) {
        showToast("Payment failed. Try again.", "error");
        return;
      }

      if (!stripePromise) {
        showToast("Stripe not initialized.", "error");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        showToast("Stripe failed to load.", "error");
        return;
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(`Payment failed. Try again. ${message}`, "error");
    }
  };

  return (
    <div className="main-content mx-auto px-5 py-13 text-black min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4 relative">
          <div className="relative inline-block">
            <FiShoppingCart className="h-16 w-16 text-orange-700" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {cart.length}
              </span>
            )}
          </div>
        </div>
        <h2 className="text-4xl font-bold text-orange-700">Cart</h2>
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-center">
          Your cart is empty.
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white shadow p-4 rounded-lg"
            >
              <div className="flex flex-col items-start space-y-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-500">Qty: {item.qty}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    showToast("Item removed from cart", "success");
                  }}
                  className="bg-orange-700 text-white px-3 py-1 rounded hover:bg-orange-800 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                clearCart();
                showToast("Cart cleared successfully!", "success");
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              Clear Cart
            </button>
            <div className="flex items-center flex-col md:flex-row gap-3">
              <span className="text-xl font-bold">
                Total: $
                {cart
                  .reduce((acc, item) => acc + item.price * item.qty, 0)
                  .toFixed(2)}
              </span>
              <button
                onClick={handleCheckout}
                className="bg-orange-700 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-800 transition-colors duration-200 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </div>
  );
};

export default CartPage;
