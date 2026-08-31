import React from "react";
import type { Metadata } from "next";
import Pricing_Wrapper from "./Pricing-Wrapper";

export const metadata: Metadata = {
  title: "Business Partnership Plans & Pricing",
  description:
    "Become a founding business partner of The Local Loop FL. Get featured in the Winter Garden business directory, newsletter, and across the site. Founders, Professional, Standard, and Basic plans available.",
  keywords: [
    "Winter Garden advertising",
    "advertise local business Winter Garden",
    "Winter Garden business directory listing",
    "The Local Loop FL pricing",
    "founding partner Winter Garden",
  ],
  alternates: { canonical: "https://thelocalloopfl.com/pricing" },
  openGraph: {
    title: "Business Partnership Plans & Pricing | The Local Loop FL",
    description:
      "Reach Winter Garden and West Orange County residents. Choose a partnership plan and get featured across The Local Loop FL.",
    url: "https://thelocalloopfl.com/pricing",
    siteName: "The Local Loop FL",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Partnership Plans & Pricing | The Local Loop FL",
    description:
      "Reach Winter Garden residents. Choose a partnership plan and get featured across The Local Loop FL.",
  },
  robots: { index: true, follow: true },
};

const page = () => {
  return (
    <>
      <Pricing_Wrapper />
    </>
  );
};

export default page;
