import Stripe from "stripe";
import { fetchStripePublicConfig } from "../src/lib/fetchStripePublicConfig";

// Runtime guard: this module reads server-only secrets and must never run in the browser.
if (typeof window !== "undefined") {
  throw new Error("lib/stripe.ts must not be imported in client-side code");
}

const API_VERSION: Stripe.LatestApiVersion = "2025-08-27.basil";

/**
 * Build a Stripe client from the server-only secret key for the active mode.
 * Secret keys come exclusively from environment variables, never from Sanity.
 */
function buildStripeFromEnv(enableSandbox: boolean): Stripe {
  const key = enableSandbox
    ? process.env.STRIPE_SECRET_KEY_SANDBOX
    : process.env.STRIPE_SECRET_KEY_LIVE;

  if (!key) {
    throw new Error(
      `Missing server environment variable: ${
        enableSandbox ? "STRIPE_SECRET_KEY_SANDBOX" : "STRIPE_SECRET_KEY_LIVE"
      }`
    );
  }

  return new Stripe(key, { apiVersion: API_VERSION });
}

/**
 * Centralised server-only Stripe accessor.
 * Returns the Stripe client plus the resolved sandbox/live flag so callers
 * (e.g. the webhook route) can pick the matching webhook secret.
 */
export async function getStripeContext(): Promise<{ stripe: Stripe; enableSandbox: boolean }> {
  const config = await fetchStripePublicConfig();
  if (!config) throw new Error("Stripe configuration not found in Sanity");
  const enableSandbox = config.enableSandbox ?? false;
  return { stripe: buildStripeFromEnv(enableSandbox), enableSandbox };
}

export async function getStripeClient(): Promise<Stripe> {
  const { stripe } = await getStripeContext();
  return stripe;
}
