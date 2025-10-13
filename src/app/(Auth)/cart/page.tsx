import type { Metadata } from "next";
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from "@/lib/sanity.image";
import CartWrapper from "./CartWrapper";

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Cart",
    description:
      "Review your selected items and proceed to secure checkout on The Local Loop FL. Support local businesses and discover unique finds from Florida.",
    keywords: [
      "shopping cart",
      "checkout",
      "local products",
      "The Local Loop FL cart",
      "Florida businesses",
    ],
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: "Cart | The Local Loop FL",
      description:
        "Review your cart and checkout with local Florida products on The Local Loop FL.",
      url: "https://thelocalloopfl.com/cart",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "Cart - The Local Loop FL",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Your Cart | The Local Loop FL",
      description:
        "Review your selected items and proceed to secure checkout on The Local Loop FL.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/cart",
    },
  };
}

export default function CartPage() {
  return <CartWrapper />;
}
