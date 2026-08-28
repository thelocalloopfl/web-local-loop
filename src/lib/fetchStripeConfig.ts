import { client } from '../../lib/sanity';

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
