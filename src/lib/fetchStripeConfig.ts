import { client } from '../../lib/sanity';

export type StripeConfig = {
  _id: string;
  enableSandbox?: boolean;
  liveKey?: string;
  liveSecret?: string;
  sandboxKey?: string;
  sandboxSecret?: string;
};

export async function fetchStripeConfig(): Promise<StripeConfig | null> {
  const query = `*[_type == "stripeConfig"][0]{
    _id,
    enableSandbox,
    liveKey,
    liveSecret,
    sandboxKey,
    sandboxSecret
  }`;

  return await client.fetch(query, {});
}
