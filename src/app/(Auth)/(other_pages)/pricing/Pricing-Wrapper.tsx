"use client";
import React, { useEffect } from "react";
import { PricingPlan } from "@/lib/fetchPricingPlans";
import PricingGrid from "../../../components/PricingGrid";
import { trackPricingView } from "../../../../../lib/gtag";

type Props = {
  plans: PricingPlan[];
  stripePublicKey: string;
};

const Pricing_Wrapper = ({ plans, stripePublicKey }: Props) => {
  useEffect(() => {
    trackPricingView();
  }, []);

  return (
    <PricingGrid
      plans={plans}
      stripePublicKey={stripePublicKey}
      onPlanClick={(plan) => (window.location.href = "/checkout/" + plan)}
    />
  );
};

export default Pricing_Wrapper;
