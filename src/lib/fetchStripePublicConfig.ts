import { client } from '../../lib/sanity';

/**
 * Public, non-secret Stripe configuration stored in Sanity.
 *
 * This is fetched through the unauthenticated Sanity CDN client and may reach
 * client components, so it MUST NOT contain secret keys. Secret keys live only
 * in server environment variables (STRIPE_SECRET_KEY_LIVE / STRIPE_SECRET_KEY_SANDBOX)
 * and are read exclusively by `lib/stripe.ts`.
 */
export type StripePublicConfig = {
  _id: string;
  enableSandbox?: boolean;
  liveKey?: string;
  sandboxKey?: string;
};

export async function fetchStripePublicConfig(): Promise<StripePublicConfig | null> {
  const query = `*[_type == "stripeConfig"][0]{
    _id,
    enableSandbox,
    liveKey,
    sandboxKey
  }`;

  return await client.fetch(query, {});
}
