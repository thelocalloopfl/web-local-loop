"use client";

import * as React from "react";
import { Crown, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { PricingPlan } from "@/lib/fetchPricingPlans";

export type PlanKey = "founders" | "professional" | "standard" | "basic";

export interface PricingGridProps {
  plans: PricingPlan[]; // 🔹 from Sanity
  stripePublicKey?: string;
  successUrl?: string;
  cancelUrl?: string;
  onPlanClick?: (plan: PlanKey) => void;
}

export default function PricingGrid({
  plans,
  stripePublicKey,
  successUrl = typeof window !== "undefined"
    ? window.location.origin + "/success"
    : "",
  cancelUrl = typeof window !== "undefined"
    ? window.location.origin + "/pricing"
    : "",
  onPlanClick,
}: PricingGridProps) {
  const stripePromise = React.useMemo(() => {
    if (!stripePublicKey) return null;
    return loadStripe(stripePublicKey);
  }, [stripePublicKey]);

async function go(plan: PlanKey, priceId: string) {
  if (!stripePromise || !priceId) {
    onPlanClick?.(plan);
    console.warn("Missing Stripe price ID for plan:", plan);
    return;
  }

  const stripe = await stripePromise;

  // 🔹 Send both plan and priceId
  const res = await fetch("/api/pricing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, priceId }),
  });

  const { sessionId } = await res.json();

  if (!sessionId) {
    alert("Could not start checkout. Please try again.");
    return;
  }

  const redirectResult = await stripe?.redirectToCheckout({ sessionId });
  if (redirectResult?.error) alert(redirectResult.error.message);
}

  

  // Sort plans to show founders first
  const sortedPlans = [...plans].sort((a, b) => {
    const order = ["founders", "professional", "standard", "basic"];
    return order.indexOf(a.key) - order.indexOf(b.key);
  });

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          The Local Loop FL — Winter Garden
        </h1>
        <p>
          Choose a plan to get featured like the streaming giants do.
        </p>
      </header>

      <section className="grid grid-cols-12 gap-5">
        {sortedPlans.map((plan) => {
          if (!plan.enabled) return null; // Skip disabled plans

          const isFounders = plan.key === "founders";
          const slots = plan.founderSettings;
          const used = Math.max(
            0,
            (slots?.totalSlots ?? 0) - (slots?.remainingSlots ?? 0)
          );
          const pct = slots?.totalSlots
            ? Math.min(100, (used / slots.totalSlots) * 100)
            : 0;

          return isFounders ? (
            // 🔹 Founders Card
            <article
              key={plan._id}
              className="col-span-12 rounded-2xl border border-black/50 bg-white/10 dark:bg-slate-900/60 shadow-xl"
            >
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center">
                    <Crown className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold">
                    {plan.title}
                  </h2>
                </div>
                {slots && (
                  <span className="inline-flex items-center gap-2 font-bold text-xs md:text-sm px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-300 shadow">
                    Only {slots.remainingSlots} of {slots.totalSlots} remaining
                  </span>
                )}
              </div>

              <div className="px-5">
                <p className="text-3xl font-extrabold">
                  ${plan.price}
                  <span className="text-sm font-semibold ">
                    /mo
                  </span>
                </p>
                {plan.subtitle && (
                  <p className=" text-sm">{plan.subtitle}</p>
                )}

                <ul
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
                  role="list"
                >
                  {plan.features?.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {slots && (
                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-lime-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Slots filled</span>
                      <span>
                        {used} / {slots.totalSlots}
                      </span>
                    </div>
                  </div>
                )}

                <div className="py-4">
                  <button
                    onClick={() => go("founders", plan.stripePriceId)}
                    disabled={
                      (slots?.remainingSlots ?? 0) <= 0 &&
                      !slots?.showWhenSoldOut
                    }
                    className="w-full md:w-auto px-15 py-3 rounded-xl font-extrabold tracking-wide bg-gradient-to-r from-orange-500 to-amber-300 shadow cursor-pointer hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {(slots?.remainingSlots ?? 0) <= 0 &&
                    !slots?.showWhenSoldOut
                      ? "Sold Out"
                      : "Select"}
                  </button>
                </div>
              </div>
            </article>
          ) : (
            // 🔹 Regular Plans (Professional, Standard, Basic)
            <PlanCard
              key={plan._id}
              planKey={plan.key as PlanKey}
              title={plan.title}
              price={plan.price}
              subtitle={plan.subtitle ?? ""}
              features={plan.features ?? []}
              highlight={plan.highlight}
              onSelect={() => go(plan.key as PlanKey, plan.stripePriceId)}
              className="col-span-12 md:col-span-4"
            />
          );
        })}
      </section>
    </div>
  );
}

interface PlanCardProps {
  planKey: PlanKey;
  title: string;
  price: number;
  subtitle: string;
  features: string[];
  highlight?: string;
  onSelect: () => void;
  className?: string;
}

function PlanCard({
  planKey,
  title,
  price,
  subtitle,
  features,
  highlight,
  onSelect,
  className,
}: PlanCardProps) {
  return (
    <article
      data-plan={planKey}
      className={`rounded-2xl border border-black/50 bg-white/10 dark:bg-slate-900/60 shadow-xl ${className}`}
      aria-label={`${title} plan`}
    >
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 grid place-items-center">
            {title === "Professional" ? (
              <Star className="h-6 w-6" />
            ) : (
              <Sparkles className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-lg md:text-xl font-extrabold">{title}</h3>
        </div>
        {highlight ? (
          <span className="inline-flex items-center gap-2 font-bold text-xs md:text-sm px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow">
            {highlight}
          </span>
        ) : null}
      </div>

      <div className="px-5 pb-5">
        <p className="text-2xl font-extrabold">
          ${price}
          <span className="text-sm font-semibold ">/mo</span>
        </p>
        <p className="text-sm">{subtitle}</p>
        <ul className="mt-4 grid gap-2 text-sm" role="list">
          {features.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="pt-4">
          <button
            onClick={onSelect}
            className="w-full px-5 py-3 cursor-pointer rounded-xl font-extrabold tracking-wide bg-gradient-to-r from-orange-500 to-amber-300 shadow hover:shadow-lg"
          >
            Select
          </button>
        </div>
      </div>
    </article>
  );
}
