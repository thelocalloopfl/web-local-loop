import React from 'react'
import SpotlightSection from '../../../components/SpotlightSection'
import { fetchSpotlights } from "../../../../lib/fetchSpotlights";
import { fetchSpotlightCategories } from "../../../../lib/fetchSpotlightCategories";
import { PiShootingStarFill } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa6";
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Local Business Spotlight",
    description:
      "Discover Winter Garden's best local businesses, restaurants, and community favorites featured in our Local Spotlight series.",
    keywords: [
      "Winter Garden business spotlight",
      "local businesses Winter Garden",
      "Winter Garden community",
      "Florida small business spotlight",
      "The Local Loop FL spotlight",
      "local restaurants Winter Garden",
    ],
    openGraph: {
      title: "Local Business Spotlight | The Local Loop FL",
      description:
        "Celebrate Winter Garden’s thriving small business community — explore our curated spotlights and discover local gems.",
      url: "https://thelocalloopfl.com/local-spotlight",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "Winter Garden Local Business Spotlight",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Local Business Spotlight | The Local Loop FL",
      description:
        "Explore Winter Garden’s top local businesses featured in The Local Loop FL spotlight series.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/local-spotlight",
    },
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
  };
}


const LocalSpotlight = async () => {

  const allSpotlights = await fetchSpotlights();
  const spotlightCategories = await fetchSpotlightCategories();
  return (
    <>
        <div className="main-content mx-auto py-16 text-black max-w-7xl">
        {/* Header */}
            <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                    <PiShootingStarFill className="h-16 w-16 text-orange-700" />
                </div>
                <h2 className="text-4xl font-bold text-orange-700">
                        Local Business Spotlight
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    Celebrating the heart of our community: the amazing local businesses that make Winter Garden unique.
                </p>
            </div>
            <SpotlightSection  allSpotlights={allSpotlights}
                categories={spotlightCategories} all={true} />

            {/* Business Featured */}
            <div className="bg-gradient-to-r from-yellow-100 via-white to-orange-100 rounded-lg shadow p-2 mt-10 py-8 text-center lg:p-8">
                <div className="flex justify-center mb-4">
                    <FaBuilding className="h-10 w-10 text-orange-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Want Your Business Featured?</h3>
                <p className="text-gray-600 mb-4 max-w-xl mx-auto">
                    We love showcasing local talent and establishments. Reach out to us for sponsorship opportunities or to be considered for a future spotlight. 
                </p>
                <Link href='/contact' className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded">
                    Learn More & Get in Touch
                </Link>
            </div>
        </div>
    </>
  )
}

export default LocalSpotlight