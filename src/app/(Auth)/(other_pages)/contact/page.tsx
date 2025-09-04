import React from "react";
import ContactSection from "../../../components/ContactSection";
import type { Metadata } from "next";
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Contact Us",
    description:
      "Get in touch with The Local Loop FL for inquiries, support, or partnerships. We’d love to hear from you!",
    keywords: [
      "Contact The Local Loop FL",
      "Local Business Support",
      "Partnership Inquiries",
      "Customer Support",
      "Florida Businesses",
      "Winter Garden community contact",
      "The Local Loop contact page",
    ],
    openGraph: {
      title: "Contact Us | The Local Loop FL",
      description:
        "Reach out to The Local Loop FL for questions, collaborations, or support.",
      url: "https://thelocalloopfl.com/contact",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl, // ✅ pulled dynamically from Sanity or fallback
          width: 1200,
          height: 630,
          alt: "Contact The Local Loop FL",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us | The Local Loop FL",
      description:
        "Reach out to The Local Loop FL for inquiries, collaborations, or customer support.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/contact",
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

const Contact = () => {
  return (
    <>
      <ContactSection />
    </>
  );
};

export default Contact;
