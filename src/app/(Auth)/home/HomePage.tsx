/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiSidebar, FiX } from "react-icons/fi";

// Lazy-load sections
const EventSection = dynamic(() => import("../../components/EventSection"));
const BlogSection = dynamic(() => import("../../components/BlogSection"));
const SpotlightSection = dynamic(() => import("../../components/SpotlightSection"));
const TopBannerSections = dynamic(() => import("../../components/TopBannerSections"));
const MiddelBanner = dynamic(() => import("../../components/MiddelBanner"));
const BottomBanner = dynamic(() => import("../../components/BottomBanner"));
const SideBar = dynamic(() => import("../../components/SideBar"));
const NewsletterBox = dynamic(() => import("../../components/NewsLetterBox"));

export default function HomePage({
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
}: any) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const bgImage = banner?.backgroundImage?.asset?.url || "";
  const hasTopBanner =
    topBanner?.text || topBanner?.imageUrl || topBanner?.title || topBanner?.buttonLink;
  const hasMiddleBanner =
    middleBanner?.text || middleBanner?.imageUrl || middleBanner?.title || middleBanner?.buttonLink;
  const hasSidebar = sidebar && Array.isArray(sidebar) && sidebar.length > 0;

  return (
    <div className="main-content-area max-w-[1200px] mx-auto">
      {/* 🔹 Top Banner */}
      {hasTopBanner && (
        <section className="container mx-auto">
          <TopBannerSections
            bgImage={topBanner.imageUrl}
            title={topBanner.title}
            text={topBanner.text}
            viewLink={topBanner.buttonLink}
          />
        </section>
      )}

      {/* 🔹 Hero Banner */}
      <section className="hero-bg-image relative max-w-[1200px] mx-auto flex items-center justify-center text-white px-5 overflow-hidden">
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          priority
          quality={80}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(90deg,#F97316 0%,#FACC15 100%)",
            opacity: 0.7,
          }}
        />
        <div className="relative z-10 max-w-4xl text-center px-4">
          <h1 className="text-4xl font-bold mb-4">{banner?.heading}</h1>
          <p className="text-lg mb-6">{banner?.subHeading}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/newsletter"
              className="bg-white text-black px-5 py-2 rounded font-medium"
            >
              Get the Newsletter
            </a>
            <a
              href="/about"
              className="bg-transparent border border-white px-5 py-2 rounded font-medium"
            >
              About Us
            </a>
            <NewsletterBox />
          </div>
        </div>
      </section>

      {/* 🔹 Events + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-5 relative mt-5 lg:mt-10">
        <div
          className={`transition-all duration-300 ${
            hasSidebar ? (sidebarVisible ? "lg:w-[80%]" : "w-full") : "w-full"
          }`}
        >
          <section className="lg:py-12 py-6 bg-white text-black">
            <h2 className="text-3xl font-semibold mb-6 text-center">Events</h2>
            <EventSection allEvents={allEvents} categories={categories} all={true} />
          </section>
        </div>

        {hasSidebar && (
          <div className="relative">
            <div className="flex justify-end mb-2 sticky top-30 z-10">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="text-gray-600 hover:text-orange-600 cursor-pointer transition rounded-full bg-orange-100 p-3"
                aria-label="Toggle sidebar"
              >
                {sidebarVisible ? <FiX className="text-2xl" /> : <FiSidebar className="text-2xl" />}
              </button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out ${
                sidebarVisible
                  ? "w-full lg:w-70 max-h-150 overflow-y-auto block"
                  : "w-0 hidden overflow-hidden"
              }`}
            >
              <SideBar sidebar={sidebar} />
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Middle Banner */}
      {hasMiddleBanner && (
        <section className="container mx-auto mt-3 lg:mt-5">
          <MiddelBanner
            bgImage={middleBanner.imageUrl}
            title={middleBanner.title}
            text={middleBanner.text}
            viewLink={middleBanner.buttonLink}
          />
        </section>
      )}

      {/* 🔹 Blog Section */}
      <section className="py-6 lg:py-12 text-black">
        <h2 className="text-3xl font-semibold mb-6 text-center">Blog</h2>
        <BlogSection allBlogs={allBlogs} categories={blogCategories} all={false} />
      </section>

      {/* 🔹 Local Spotlight */}
      <section className="py-6 lg:py-12 bg-white text-black">
        <h2 className="text-3xl font-semibold mb-6 text-center">Local Spotlight</h2>
        <SpotlightSection allSpotlights={allSpotlights} categories={spotlightCategories} all={false} />
      </section>

      {/* 🔹 Bottom Banner */}
      <section className="container mx-auto flex text-black mt-4 lg:mt-8">
        <div className="main-content mx-auto flex justify-center items-center rounded-xl bg-gradient-to-r from-[#F97316] to-[#FACC15]">
          <BottomBanner />
        </div>
      </section>
    </div>
  );
}
