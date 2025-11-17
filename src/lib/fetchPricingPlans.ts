import { client } from '../../lib/sanity';
import { groq } from "next-sanity";

/* -------------------------------------------------------------------------- */
/*  TYPE DEFINITIONS  */
/* -------------------------------------------------------------------------- */

export type FounderSettings = {
  totalSlots?: number;
  remainingSlots?: number;
  showWhenSoldOut?: boolean;
};

export type PricingPlan = {
  _id: string;
  key: "founders" | "professional" | "standard" | "basic";
  title: string;
  subtitle?: string;
  price: number;
  stripePriceId: string;
  highlight?: string;
  features: string[];
  enabled: boolean;
  founderSettings?: FounderSettings;
};

/* -------------------------------------------------------------------------- */
/*  FETCH FUNCTION  */
/* -------------------------------------------------------------------------- */

/**
 * Fetch all pricing plans from Sanity.
 * Includes nested founders settings (if present).
 */
export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  const query = groq`
    *[_type == "pricingPlan"] | order(_createdAt asc) {
      _id,
      key,
      title,
      subtitle,
      price,
      stripePriceId,
      highlight,
      features,
      enabled,
      founderSettings {
        totalSlots,
        remainingSlots,
        showWhenSoldOut
      }
    }
  `;

  return await client.fetch(query, {});
}
