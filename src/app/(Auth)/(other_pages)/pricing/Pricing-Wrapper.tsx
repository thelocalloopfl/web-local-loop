"use client"
import React, { useEffect, useState } from "react";
import { fetchStripePublicConfig } from "@/lib/fetchStripePublicConfig";
import { fetchPricingPlans, PricingPlan } from "@/lib/fetchPricingPlans";
import PricingGrid from "../../../components/PricingGrid";

const Pricing_Wrapper = () => {
  const [stripeKey, setStripeKey] = useState("");
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  useEffect(() => {
    async function init() {
      const config = await fetchStripePublicConfig();
      if (!config) return;
      setStripeKey((config.enableSandbox ? config.sandboxKey : config.liveKey) ?? "");

      const sanityPlans = await fetchPricingPlans();
      setPlans(sanityPlans);
    }
    init();
  }, []);
  return (
    <PricingGrid
      plans={plans}
      stripePublicKey={stripeKey}
      onPlanClick={(plan) => (window.location.href = "/checkout/" + plan)}
    />
  );
};

export default Pricing_Wrapper;
