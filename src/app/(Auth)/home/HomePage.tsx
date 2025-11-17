/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiSidebar, FiX } from "react-icons/fi";
import { FaCalendarAlt, FaNewspaper, FaBullhorn } from "react-icons/fa"; // Added icons for fallbacks

// Lazy-load sections
const EventSection = dynamic(() => import("../../components/EventSection"));
const BlogSection = dynamic(() => import("../../components/BlogSection"));
const SpotlightSection = dynamic(() => import("../../components/SpotlightSection"));
const TopBannerSections = dynamic(() => import("../../components/TopBannerSections"));
const MiddelBanner = dynamic(() => import("../../components/MiddelBanner"));
const BottomBanner = dynamic(() => import("../../components/BottomBanner"));
const SideBar = dynamic(() => import("../../components/SideBar"));
const NewsletterBox = dynamic(() => import("../../components/NewsLetterBox"));

// --- Fallback Component ---
// A reusable component for showing "No Data" content
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
// --- End Fallback Component ---


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

  // Check data availability, assuming data is an array
  const hasEvents = Array.isArray(allEvents) && allEvents.length > 0;
  const hasBlogs = Array.isArray(allBlogs) && allBlogs.length > 0;
  const hasSpotlights = Array.isArray(allSpotlights) && allSpotlights.length > 0;

  const bgImage = banner?.backgroundImage?.asset?.url || "";
  const hasTopBanner =
    topBanner?.text || topBanner?.imageUrl || topBanner?.title || topBanner?.buttonLink;
  const hasMiddleBanner =
    middleBanner?.text || middleBanner?.imageUrl || middleBanner?.title || middleBanner?.buttonLink;
  const hasSidebar = sidebar && Array.isArray(sidebar) && sidebar.length > 0;

  return (
    <div
      className="
        main-content-area max-w-[1200px] mx-auto
        transition-colors duration-300
        bg-[var(--background)] text-[var(--foreground)]
      "
    >
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

      {/* 🔹 Hero Banner (no change needed) */}
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
          <h1 className="text-4xl font-bold mb-4 drop-shadow-md">{banner?.heading}</h1>
          <p className="text-lg mb-6">{banner?.subHeading}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/newsletter"
              className="
                bg-white text-black 
                px-5 py-2 rounded font-medium transition-all duration-200
                hover:opacity-80
              "
            >
              Get the Newsletter
            </a>
            <a
              href="/about"
              className="
                bg-transparent border border-white text-white
                px-5 py-2 rounded font-medium transition-all duration-200
                hover:bg-white hover:text-black
              "
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
          <section
            className="
              lg:py-12 py-6 
              bg-[var(--background)] text-[var(--foreground)] 
              transition-colors duration-300 rounded-xl
            "
          >
            <h2 className="text-3xl font-semibold mb-6 text-center">Events</h2>
            {/* --- Events Fallback Logic --- */}
            {hasEvents ? (
              <EventSection allEvents={allEvents} categories={categories} all={true} />
            ) : (
              <NoDataFallback 
                title="No Events Scheduled Yet"
                icon={<FaCalendarAlt />}
                message="We're currently planning new events. Check back soon for exciting updates, or contact us if you'd like to suggest one!"
              />
            )}
            {/* ----------------------------- */}
          </section>
        </div>

        {hasSidebar && (
          <div className="relative">
            <div className="flex justify-end mb-2 sticky top-30 z-10">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="
                  text-[var(--foreground)] hover:text-[var(--main-orange)] cursor-pointer 
                  transition rounded-full bg-[var(--footer-bg)] p-3
                "
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
      <section
        className="
          py-6 lg:py-12 
          bg-[var(--background)] text-[var(--foreground)] 
          transition-colors duration-300 rounded-xl 
        "
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Blog</h2>
        {/* --- Blog Fallback Logic --- */}
        {hasBlogs ? (
          <BlogSection allBlogs={allBlogs} categories={blogCategories} all={false} />
        ) : (
          <NoDataFallback 
            title="No Recent Blog Posts"
            icon={<FaNewspaper />}
            message="We're currently drafting new content! Check back soon or subscribe to the newsletter to get the latest articles delivered to your inbox."
          />
        )}
        {/* ------------------------- */}
      </section>

      {/* 🔹 Local Spotlight */}
      <section
        className="
          py-6 lg:py-12 
          bg-[var(--background)] text-[var(--foreground)] 
          transition-colors duration-300 rounded-xl 
        "
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Local Spotlight</h2>
        {/* --- Spotlight Fallback Logic --- */}
        {hasSpotlights ? (
          <SpotlightSection
            allSpotlights={allSpotlights}
            categories={spotlightCategories}
            all={false}
          />
        ) : (
          <NoDataFallback 
            title="No Local Spotlights Available"
            icon={<FaBullhorn />}
            message="We love featuring local heroes! If you know someone deserving of a spotlight, please reach out to us."
          />
        )}
        {/* ----------------------------- */}
      </section>

      {/* 🔹 Bottom Banner */}
      <section className="container mx-auto flex mt-4 lg:mt-8">
        <div className="main-content mx-auto flex justify-center items-center rounded-xl bg-gradient-to-r from-[#F97316] to-[#FACC15]">
          <BottomBanner />
        </div>
      </section>
    </div>
  );
}