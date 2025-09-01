import { Suspense } from "react";
import SuccessInvoice from "./SuccessInvoice";
import type { Metadata } from "next";
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';


export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Order Success ",
    description:
      "Thank you for your order! Your purchase supports local Florida businesses. View your invoice and order details here.",
    keywords: [
      "order success",
      "invoice",
      "checkout complete",
      "local products",
      "The Local Loop FL",
    ],
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: "Order Success | The Local Loop FL",
      description:
        "Thank you for shopping local! View your invoice and order summary on The Local Loop FL.",
      url: "https://thelocalloopfl.com/success",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "Order Success - The Local Loop FL",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Order Success | The Local Loop FL",
      description:
        "Your order was successful — thank you for supporting local Florida businesses!",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/success",
    },
  };
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-orange-500 animate-pulse">Loading invoice...</p>
        </div>
      }
    >
      <SuccessInvoice />
    </Suspense>
  );
}
