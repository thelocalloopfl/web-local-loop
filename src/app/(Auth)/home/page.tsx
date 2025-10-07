import Image from 'next/image';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { client } from '../../../../lib/sanity';
import { urlFor } from '@/lib/sanity.image';
import { fetchEvents } from '../../../../lib/queries';
import { fetchCategories } from '../../../lib/fetchCategories';
import { fetchBlogs } from '../../../lib/fetchBlogs';
import { fetchBlogCategories } from '../../../lib/fetchBlogCategories';
import { fetchSpotlights } from '../../../lib/fetchSpotlights';
import { fetchSpotlightCategories } from '../../../lib/fetchSpotlightCategories';
import { fetchTopBanner } from '@/lib/fetchTopBanner';
import { fetchMiddleBanner } from '@/lib/fetchMiddleBanner';
import { fetchSideBar } from '@/lib/fetchSidebar';
import { fetchSiteLogo } from '@/lib/fetchLogo';

import { EventItem } from '../../../../types/event';

// Lazy-loaded components
const EventSection = dynamic(() => import('../../components/EventSection'));
const BlogSection = dynamic(() => import('../../components/BlogSection'));
const SpotlightSection = dynamic(() => import('../../components/SpotlightSection'));
const TopBannerSections = dynamic(() => import('../../components/TopBannerSections'));
const MiddelBanner = dynamic(() => import('../../components/MiddelBanner'));
const BottomBanner = dynamic(() => import('../../components/BottomBanner'));
const SideBar = dynamic(() => import('../../components/SideBar'));
const NewsletterBox = dynamic(() => import('../../components/NewsLetterBox'));

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo ? urlFor(logo.logo).width(1200).height(630).url() : 'https://thelocalloopfl.com/default-logo.png';
  return {
    
    description:
      "Discover the best local events, stories, and businesses in Florida. Stay connected with blogs, spotlights, and community highlights on The Local Loop FL.",
    keywords: [
      "Florida events",
      "local blogs",
      "community news",
      "The Local Loop FL",
      "local businesses",
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
      description: "Discover the best local events, stories, and businesses in Florida.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com",
    },
  };
}


type BannerData = {
  backgroundImage?: {
    asset?: {
      url?: string;
    };
  };
  heading?: string;
  subHeading?: string;
  buttonOneText?: string;
  buttonOneLink?: string;
  buttonTwoText?: string;
  buttonTwoLink?: string;
};

async function getBannerData(): Promise<BannerData> {
  const query = `*[_type == "bannerSection"][0]{
    backgroundImage{asset->{url}},
    heading,
    subHeading,
    buttonOneText,
    buttonOneLink,
    buttonTwoText,
    buttonTwoLink
  }`;

  return await client.fetch(query, {} );
}

export default async function HomePage() {
  const banner = await getBannerData();
  const allEvents: EventItem[] = await fetchEvents();
  const categories = await fetchCategories();
  const allBlogs = await fetchBlogs();
  const blogCategories = await fetchBlogCategories();
  const allSpotlights = await fetchSpotlights();
  const spotlightCategories = await fetchSpotlightCategories();
  const topBanner = await fetchTopBanner();
  const middleBanner = await fetchMiddleBanner();
  const sidebar = await fetchSideBar();
  const bgImage = banner?.backgroundImage?.asset?.url || '';

  const topBannerTitle = topBanner?.text || '';
  const topBannerImg = topBanner?.imageUrl || '';
  const topBannerlink = topBanner?.buttonLink || '';
  
  const middleBannerTitle = middleBanner?.text || '';
  const middleBannerImg = middleBanner?.imageUrl || '';
  const middleBannerlink = middleBanner?.buttonLink || '';

  return (
    <div className="main-content-area  max-w-[1200px] mx-auto">

      {/*Top banner Section  */}
      <section className="container mx-auto">
        <TopBannerSections bgImage={topBannerImg} text={topBannerTitle} viewLink={topBannerlink} />
      </section>

      {/* Banner Section */}
      <section
        className="hero-bg-image max-w-[1200px] mx-auto flex items-center justify-center text-white px-5 relative overflow-hidden"
      >
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          priority
          quality={80}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 mix-blend-multiply"></div>

        {/* Gradient overlay for better contrast */}
        <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none" style={{background: 'linear-gradient(90deg,#F97316 0%,#FACC15 100%)', opacity: 0.7}} />
        <div className="relative z-10 max-w-4xl text-center px-4">
          <h1 className="text-4xl font-bold mb-4">{banner?.heading}</h1>
          <p className="text-lg mb-6">{banner?.subHeading}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* {banner?.buttonOneText && banner?.buttonOneLink && (
              <a
                href={banner.buttonOneLink}
                className="bg-white text-black px-5 py-2 rounded font-medium"
              >
                {banner.buttonOneText}
              </a>
            )} */}
            {/* {banner?.buttonTwoText && banner?.buttonTwoLink && (
              <a
                href={banner.buttonTwoLink}
                className="bg-transparent border border-white px-5 py-2 rounded font-medium"
              >
                {banner.buttonTwoText}
              </a>
            )} */}
              <a
                href='/newsletter'
                className="bg-white text-black px-5 py-2 rounded font-medium"
              >
                Get the Newsletter
              </a>
              <a
                href='/about'
                className="bg-transparent border border-white px-5 py-2 rounded font-medium"
              >
                About Us
              </a>
            <NewsletterBox/>
          </div>
        </div>
      </section>

      <div className="main-content flex flex-col lg:flex-row gap-5">
        {/* Main Content */}
        <div className="flex-1">

          {/* Events Section */}
          <section className="py-12 px-0 w-full bg-white text-black">
            <div className="main-content mx-auto">
              <h2 className="text-3xl font-semibold mb-6 text-center">Events</h2>
              <EventSection allEvents={allEvents} categories={categories} all={true} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full max-h-165 lg:w-70  mt-0 lg:mt-26 overflow-y-auto">
          <SideBar  sidebar = { sidebar }  />
        </div>
      </div>

          {/* Middle Banner Section */}
          <section className="container mx-auto mt-5">
            <MiddelBanner bgImage={middleBannerImg} text={middleBannerTitle}  viewLink={middleBannerlink}/>
          </section>

      {/* Blog Section */}
          <section className="py-12 px-0 w-full text-black">
            <div className="main-content mx-auto ">
              <h2 className="text-3xl font-semibold mb-6 text-center">Blog</h2>
              <BlogSection allBlogs={allBlogs} categories={blogCategories} all={false} />
            </div>
          </section> 

          {/* Spotlight Section */}
          <section className="py-12 px-0 w-full bg-white text-black">
            <div className="main-content mx-auto">
              <h2 className="text-3xl font-semibold mb-6 text-center">Local Spotlight</h2>
              <SpotlightSection
                allSpotlights={allSpotlights}
                categories={spotlightCategories}
                all={false}
              />
            </div>
          </section>

          {/* Bottom Banner Section */}
          <section className="container mx-auto flex  text-black">
            <div className="main-content mx-auto flex justify-center items-center  rounded-xl bg-gradient-to-r from-[#F97316] to-[#FACC15]">
              <BottomBanner />
            </div>
          </section>
    </div>
  );
}
