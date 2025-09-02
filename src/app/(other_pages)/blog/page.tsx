import React from 'react'
import BlogSection from '../../components/BlogSection'
import { fetchBlogs } from "../../../lib/fetchBlogs";
import { fetchBlogCategories } from "../../../lib/fetchBlogCategories";
import type { Metadata } from 'next';
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "The Local Loop Blog | Local News & Community Updates",
    description:
      "Discover the latest community news, restaurant reviews, interviews, guides, and events in Winter Garden. Stay connected with The Local Loop Blog.",
    keywords: [
      "Winter Garden blog",
      "local news Winter Garden",
      "community events Winter Garden",
      "restaurant reviews Winter Garden",
      "Winter Garden guides",
      "The Local Loop blog",
      "local updates",
    ],
    openGraph: {
      title: "The Local Loop Blog",
      description:
        "Stay informed with the latest events, interviews, restaurant reviews, and guides from Winter Garden on The Local Loop Blog.",
      url: "https://thelocalloopfl.com/blog",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "The Local Loop Blog - Winter Garden News",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "The Local Loop Blog | Local News & Community Updates",
      description:
        "Your source for Winter Garden community news, restaurant reviews, guides, and more on The Local Loop Blog.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/blog",
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

const Blog =  async () => {
const allBlogs = await fetchBlogs();
const blogCategories = await fetchBlogCategories();

  return (
    <>
        <div className="main-content mx-auto px-5 py-16 text-black max-w-7xl">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-orange-700">
                  The Local Loop Blog
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                  Your source for community events, local restaurant reviews, interview, guides and all other things Winter Garden.
                </p>
              </div>
            <BlogSection allBlogs={allBlogs} categories={blogCategories} all={true} />
        </div>
    </>
  )
}

export default Blog