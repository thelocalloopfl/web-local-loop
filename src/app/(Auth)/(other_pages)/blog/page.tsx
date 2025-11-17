import React from 'react'
import BlogSection from '../../../components/BlogSection'
import { fetchBlogs } from "../../../../lib/fetchBlogs";
import { fetchBlogCategories } from "../../../../lib/fetchBlogCategories";
import type { Metadata } from 'next';
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';
import {  FaNewspaper } from "react-icons/fa";

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

const NoDataFallback = ({ title, icon, message }: { title: string, icon: React.ReactNode, message: string }) => (
  <div className="text-center p-10 border border-dashed border-[var(--border-color)] rounded-lg mx-auto max-w-xl my-8">
    <div className="text-4xl text-[var(--main-orange)] mx-auto mb-4 w-fit">
        {icon}
    </div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-[var(--text-muted)]">{message}</p>
    <a href="/contact" className="mt-4 inline-block bg-[var(--main-orange)] text-white px-4 py-2 rounded transition-opacity hover:opacity-90">
      Contact Us
    </a>
  </div>
);

const Blog =  async () => {
const allBlogs = await fetchBlogs();
const blogCategories = await fetchBlogCategories();
const hasBlogs = Array.isArray(allBlogs) && allBlogs.length > 0;

  return (
    <>
        <div className="main-content mx-auto py-16 max-w-7xl">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-orange-700">
                  The Local Loop Blog
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                  Your source for community events, local restaurant reviews, interview, guides and all other things Winter Garden.
                </p>
              </div>
               {hasBlogs ? (
                        <BlogSection allBlogs={allBlogs} categories={blogCategories} all={true} />
                      ) : (
                        <NoDataFallback 
                          title="No Recent Blog Posts"
                          icon={<FaNewspaper />}
                          message="We're currently drafting new content! Check back soon or subscribe to the newsletter to get the latest articles delivered to your inbox."
                        />
                      )}
           
        </div>
    </>
  )
}

export default Blog