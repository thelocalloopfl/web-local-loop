export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

const canTrack = () =>
  typeof window !== "undefined" &&
  typeof window.gtag === "function" &&
  !!GA_MEASUREMENT_ID;

export const pageview = (url: string) => {
  if (!canTrack()) return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/**
 * Fire a GA4 event. No-ops safely when analytics is unavailable
 * (missing consent, ad blocker, missing GA id, SSR).
 */
export const event = (
  name: string,
  params: Record<string, string | number | boolean | undefined> = {}
) => {
  if (!canTrack()) return;
  window.gtag("event", name, params);
};

/* ---- Named conversion events used across the site ---- */

export const trackNewsletterSignup = (location: string) =>
  event("newsletter_signup", { method: "beehiiv", location });

export const trackPricingView = () => event("pricing_view", {});

export const trackSelectPlan = (plan: string, price?: number) =>
  event("select_plan", { plan, price, currency: "USD" });

export const trackBeginCheckout = (
  context: "pricing" | "shop",
  value?: number,
  plan?: string
) =>
  event("begin_checkout", {
    checkout_context: context,
    value,
    currency: "USD",
    plan,
  });

export const trackEventView = (slug: string, title: string) =>
  event("event_view", { slug, title });

export const trackDirectoryEngagement = (
  action: "search" | "filter_category" | "contact_click",
  detail?: string
) => event("directory_engagement", { action, detail });

export const trackAdvertiseLead = () =>
  event("generate_lead", { form: "advertise" });
