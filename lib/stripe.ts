import Stripe from "stripe";
import { fetchStripeConfig } from "../src/lib/fetchStripeConfig";

export async function getStripeClient() {
  const config = await fetchStripeConfig();

  if (!config) {
    throw new Error("Stripe configuration not found in Sanity");
  }

  const secretKey = config.enableSandbox ? config.sandboxSecret : config.liveSecret;

  if (!secretKey) {
    throw new Error("Stripe secret key is missing in Sanity config");
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil",
  });
}
