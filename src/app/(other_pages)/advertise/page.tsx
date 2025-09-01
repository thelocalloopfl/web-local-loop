// app/advertise/page.tsx
import type { Metadata } from "next";
import AdvertisePage from "../../components/AdvertisePage";
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Advertise With Us",
    description:
      "Partner with The Local Loop FL to promote your business to engaged Winter Garden locals. Sponsorships, ads, and content opportunities available.",
    keywords: [
      "Winter Garden advertising",
      "local business promotion",
      "Florida sponsorship opportunities",
      "Winter Garden newsletter ads",
      "advertise with The Local Loop FL",
      "Winter Garden marketing",
      "local community advertising",
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
      title: "Advertise With The Local Loop FL",
      description:
        "Grow your business by connecting with Winter Garden’s most engaged community through ads, sponsorships, and content features.",
      url: "https://thelocalloopfl.com/advertise",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "Advertise with The Local Loop FL",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Advertise With The Local Loop FL",
      description:
        "Showcase your business to Winter Garden locals with newsletter sponsorships, banner ads, and more.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/advertise",
    },
  };
}

export default function Advertise() {
  return <AdvertisePage />;
}
