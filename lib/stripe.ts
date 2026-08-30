import Stripe from 'stripe';
import { fetchStripePublicConfig } from '../src/lib/fetchStripeConfig';

// Runtime guard: this module must never run in the browser.
if (typeof window !== 'undefined') {
  throw new Error('lib/stripe.ts must not be imported in client-side code');
}

const API_VERSION: Stripe.LatestApiVersion = '2025-08-27.basil';

function buildStripeFromEnv(enableSandbox: boolean | undefined): Stripe {
  const key = enableSandbox
    ? process.env.STRIPE_SECRET_KEY_SANDBOX
    : process.env.STRIPE_SECRET_KEY_LIVE;

  if (!key) {
    throw new Error(
      `Missing server environment variable: ${enableSandbox ? 'STRIPE_SECRET_KEY_SANDBOX' : 'STRIPE_SECRET_KEY_LIVE'}`
    );
  }

  return new Stripe(key, { apiVersion: API_VERSION });
}

export async function getStripeClient(): Promise<Stripe> {
  const config = await fetchStripePublicConfig();
  if (!config) throw new Error('Stripe configuration not found in Sanity');
  return buildStripeFromEnv(config.enableSandbox);
}

export async function getStripeContext(): Promise<{ stripe: Stripe; enableSandbox: boolean }> {
  const config = await fetchStripePublicConfig();
  if (!config) throw new Error('Stripe configuration not found in Sanity');
  const enableSandbox = config.enableSandbox ?? false;
  return { stripe: buildStripeFromEnv(enableSandbox), enableSandbox };
}
