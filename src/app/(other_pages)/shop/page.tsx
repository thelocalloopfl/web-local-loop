import React from 'react';
import ShopSection from '../../components/ShopSection';
import { fetchShopItems } from "@/lib/fetchShopItem";
import type { Metadata } from 'next';
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Shop",
    description:
      "Explore exclusive Winter Garden merchandise at The Local Loop Shop. Show your community pride with apparel, accessories, and more.",
    keywords: [
      "Winter Garden merchandise",
      "The Local Loop Shop",
      "Florida local shop",
      "Winter Garden apparel",
      "community merchandise",
      "buy local Winter Garden",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: "Shop | The Local Loop FL",
      description:
        "Support local Winter Garden businesses with exclusive items from The Local Loop Shop — apparel, accessories, and more.",
      url: "https://thelocalloopfl.com/shop",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "The Local Loop Shop Winter Garden",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Shop | The Local Loop FL",
      description:
        "Get exclusive Winter Garden merchandise from The Local Loop Shop — apparel, accessories, and more.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/shop",
    },
  };
}

const Page = async () => {
  const shopItems = await fetchShopItems();
  return (
    <>
        <ShopSection shopItems={shopItems} />
    </>
  );
}

export default Page;
