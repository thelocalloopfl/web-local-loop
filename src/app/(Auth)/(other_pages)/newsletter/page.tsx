import React from 'react'
import Newsletter from '../../../components/Newsletter'
import type { Metadata } from "next";
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';


export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Newsletter ",
    description:
      "Stay in the loop with our free weekly newsletter — get local events, Winter Garden stories, restaurant spotlights, and community updates straight to your inbox.",
    keywords: [
      "Winter Garden newsletter",
      "Florida community updates",
      "local events newsletter",
      "The Local Loop FL",
      "subscribe newsletter",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: "Join The Local Loop FL Newsletter",
      description:
        "Get the best of Winter Garden — events, blogs, and local stories delivered weekly to your inbox.",
      url: "https://thelocalloopfl.com/newsletter",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "The Local Loop FL Newsletter",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Join The Local Loop FL Newsletter",
      description:
        "Sign up for weekly updates on Winter Garden events, blogs, and local spotlights.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/newsletter",
    },
  };
}
const NewsLetter = () => {
  return (
    <>
        <Newsletter/>
    </>
  )
}

export default NewsLetter