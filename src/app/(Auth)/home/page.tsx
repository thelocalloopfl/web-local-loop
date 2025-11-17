import type { Metadata } from "next";
import HomePage from "./HomePage";
import { urlFor } from "@/lib/sanity.image";
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { client } from "../../../../lib/sanity";
import { fetchEvents } from "../../../../lib/queries";
import { fetchCategories } from "../../../lib/fetchCategories";
import { fetchBlogs } from "../../../lib/fetchBlogs";
import { fetchBlogCategories } from "../../../lib/fetchBlogCategories";
import { fetchSpotlights } from "../../../lib/fetchSpotlights";
import { fetchSpotlightCategories } from "../../../lib/fetchSpotlightCategories";
import { fetchTopBanner } from "@/lib/fetchAds/fetchTopBanner";
import { fetchBottomBanner } from "@/lib/fetchAds/fetchBottomBanner";
import { fetchRailAds } from "@/lib/fetchAds/fetchRailAds";

import { EventItem } from "../../../../types/event";


// ✅ Fetch Banner Data
async function getBannerData() {
  const query = `*[_type == "bannerSection"][0]{
    backgroundImage{asset->{url}},
    heading,
    subHeading,
    buttonOneText,
    buttonOneLink,
    buttonTwoText,
    buttonTwoLink
  }`;
  return await client.fetch(query);
}

// ✅ SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo?.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "The Local Loop FL | Local Events, Blogs & Spotlights",
    description:
      "Discover the best local events, stories, and businesses in Florida. Stay connected with blogs, spotlights, and community highlights on The Local Loop FL.",
    keywords: [
      "Florida events",
      "local blogs",
      "community news",
      "The Local Loop FL",
      "local businesses",
    ],
    openGraph: {
      title: "The Local Loop FL | Local Events, Blogs & Spotlights",
      description:
        "Discover the best local events, stories, and businesses in Florida. Stay connected with blogs, spotlights, and community highlights.",
      url: "https://thelocalloopfl.com",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "The Local Loop FL Logo",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "The Local Loop FL | Local Events, Blogs & Spotlights",
      description:
        "Discover the best local events, stories, and businesses in Florida.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com",
    },
  };
}

// ✅ Main Page (Server Side)
export default async function Page() {
  const [
    banner,
    allEvents,
    categories,
    allBlogs,
    blogCategories,
    allSpotlights,
    spotlightCategories,
    topBanner,
    middleBanner,
    sidebar,
  ] = await Promise.all([
    getBannerData(),
    fetchEvents(),
    fetchCategories(),
    fetchBlogs(),
    fetchBlogCategories(),
    fetchSpotlights(),
    fetchSpotlightCategories(),
    fetchTopBanner(),
    fetchBottomBanner(),
    fetchRailAds(),
  ]);

  return (
    <HomePage
      banner={banner}
      allEvents={allEvents}
      categories={categories}
      allBlogs={allBlogs}
      blogCategories={blogCategories}
      allSpotlights={allSpotlights}
      spotlightCategories={spotlightCategories}
      topBanner={topBanner}
      middleBanner={middleBanner}
      sidebar={sidebar}
    />
  );
}
