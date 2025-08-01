
import { client } from '../../lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { fetchEvents } from '../../lib/queries';
import { EventItem } from '../../types/event';
import EventSection from "./components/EventSection";
import { fetchCategories } from "../lib/fetchCategories";
import { fetchBlogs } from "../lib/fetchBlogs";
import { fetchBlogCategories } from "../lib/fetchBlogCategories";
import BlogSection from "./components/BlogSection";
import { fetchSpotlights } from "../lib/fetchSpotlights";
import { fetchSpotlightCategories } from "../lib/fetchSpotlightCategories";
import SpotlightSection from "./components/SpotlightSection";

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
  return await client.fetch(query);
}

export default async function HomePage() {
  const banner = await getBannerData();
  const allEvents: EventItem[] = await fetchEvents();
  const categories = await fetchCategories();
  const allBlogs = await fetchBlogs();
  const blogCategories = await fetchBlogCategories();
  const allSpotlights = await fetchSpotlights();
  const spotlightCategories = await fetchSpotlightCategories();
  const bgImage = banner?.backgroundImage?.asset?.url || '';

  // Hydrate events on client for pagination
  // Use a wrapper ClientComponent for event list
  return (
    <div className="main-content-area">
      {/* Banner Section */}
      <section
        className="hero-bg-image flex items-center justify-center text-white px-5 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(90deg,#F97316 0%,#FACC15 100%), url(${bgImage})`,
          backgroundBlendMode: 'multiply',
        }}
      >
        {/* Gradient overlay for better contrast */}
        <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none" style={{background: 'linear-gradient(90deg,#F97316 0%,#FACC15 100%)', opacity: 0.7}} />
        <div className="relative z-10 max-w-4xl text-center px-4">
          <h1 className="text-4xl font-bold mb-4">{banner?.heading}</h1>
          <p className="text-lg mb-6">{banner?.subHeading}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {banner?.buttonOneText && banner?.buttonOneLink && (
              <a
                href={banner.buttonOneLink}
                className="bg-white text-black px-5 py-2 rounded font-medium"
              >
                {banner.buttonOneText}
              </a>
            )}
            {banner?.buttonTwoText && banner?.buttonTwoLink && (
              <a
                href={banner.buttonTwoLink}
                className="bg-transparent border border-white px-5 py-2 rounded font-medium"
              >
                {banner.buttonTwoText}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 px-0 w-full bg-white">
        <div className="main-content mx-auto px-5">
          <h2 className="text-3xl font-semibold mb-6 text-center">Events</h2>
          <EventSection allEvents={allEvents} categories={categories} />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 px-0 w-full bg-gray-50">
        <div className="main-content mx-auto px-5">
          <h2 className="text-3xl font-semibold mb-6 text-center">Blog</h2>
          <BlogSection allBlogs={allBlogs} categories={blogCategories} />
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-12 px-0 w-full bg-white">
        <div className="main-content mx-auto px-5">
          <h2 className="text-3xl font-semibold mb-6 text-center">Local Spotlight</h2>
          <SpotlightSection allSpotlights={allSpotlights} categories={spotlightCategories} />
        </div>
      </section>
    </div>
  );
}
