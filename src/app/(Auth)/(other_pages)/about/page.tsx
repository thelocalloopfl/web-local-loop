import React from 'react'
import AboutSection from '../../../components/AboutSection'
import type { Metadata } from 'next';
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo ? urlFor(logo.logo).width(1200).height(630).url() : 'https://thelocalloopfl.com/default-logo.png';
  return {
    title: "About Us",
    description:
      "Learn about The Local Loop FL — our mission, vision, and passion for connecting Winter Garden and Florida communities through events, blogs, and local stories.",
    keywords: [
      "About The Local Loop FL",
      "Florida local community",
      "Winter Garden news",
      "local blogs",
      "support small business Florida",
      "local events Florida",
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
      title: "About The Local Loop FL",
      description:
        "Discover our mission and vision — connecting communities, supporting local businesses, and highlighting Florida’s hidden gems.",
      url: "https://thelocalloopfl.com/about",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "About The Local Loop FL",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: "About The Local Loop FL",
      description:
        "Learn about our mission to connect Winter Garden and Florida communities with local events, blogs, and stories.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/about",
    },
  };
}
const About = () => {
  return (
    <>
      <AboutSection />
    </>
  )
}

export default About