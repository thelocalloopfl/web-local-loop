import React from 'react'
import DirectorySection from '../../../components/DirectorySection'
import { fetchDirectory } from "../../../../lib/fetchDirectory";
import { fetchDirectoryCategory } from "../../../../lib/fetchDirectoryCategories";
import { FiLayers } from "react-icons/fi";
import type { Metadata } from "next";
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Local Business Directory",
    description:
      "Discover trusted local businesses, shops, and services in Winter Garden and beyond. Search by category and connect with your community through The Local Loop Directory.",
    keywords: [
      "Local Business Directory",
      "Winter Garden business directory",
      "Find local services",
      "Florida small businesses",
      "The Local Loop FL directory",
      "Community business listings",
      "Local shops Winter Garden",
    ],
    openGraph: {
      title: "Local Business Directory | The Local Loop FL",
      description:
        "Browse and discover Winter Garden’s best local businesses and services with The Local Loop Directory.",
      url: "https://thelocalloopfl.com/directory",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "The Local Loop FL Directory",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Local Business Directory | The Local Loop FL",
      description:
        "Connect with trusted local businesses, shops, and services in your community with The Local Loop Directory.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/directory",
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

const DirectoryPage = async () => {
  const allDirectories = await fetchDirectory();
  const directoryCategories = await fetchDirectoryCategory();

  return (
    <>
      <div className="main-content mx-auto px-5 py-16 text-black max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="flex justify-center mb-4">
                <FiLayers className="h-16 w-16 text-orange-700" />
            </div>
          </div>
          {/* Title */}
          <h2 className="text-4xl font-bold text-orange-700">
            The Local Loop Directory
          </h2>
        </div>

        <DirectorySection 
          allDirectories={allDirectories} 
          categories={directoryCategories} 
          all={true} 
        />
      </div>
    </>
  )
}

export default DirectoryPage
