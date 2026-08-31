/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { FiSidebar, FiX } from "react-icons/fi";
import TopBannerSections from "../../components/TopBannerSections";
import MiddelBanner from "../../components/MiddelBanner";
import SideBar from "../../components/SideBar";

import { fetchTopBanner } from "@/lib/fetchAds/fetchTopBanner";
import { fetchBottomBanner } from "@/lib/fetchAds/fetchBottomBanner";
import { fetchRailAds } from "@/lib/fetchAds/fetchRailAds";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [topBanner, setTopBanner] = useState<any>(null);
  const [middleBanner, setMiddleBanner] = useState<any>(null);
  const [sidebar, setSidebar] = useState<any>(null);

  useEffect(() => {
    // Ads/banners are optional decoration. Load them in the background and never
    // let a fetch failure block the page content.
    fetchTopBanner().then(setTopBanner).catch(() => {});
    fetchBottomBanner().then(setMiddleBanner).catch(() => {});
    fetchRailAds().then(setSidebar).catch(() => {});
  }, []);

  const hasTopBanner =
    topBanner?.title ||
    topBanner?.imageUrl ||
    topBanner?.text ||
    topBanner?.buttonLink;
  const hasMiddleBanner =
    middleBanner?.title ||
    middleBanner?.imageUrl ||
    middleBanner?.text ||
    middleBanner?.buttonLink;
  const hasSidebar = sidebar && Array.isArray(sidebar) && sidebar.length > 0;

  return (
    <div
      className="
        relative max-w-[1200px] mx-auto
        transition-colors duration-300
        bg-[var(--background)] text-[var(--foreground)]
      "
    >
      {/* 🔹 Top Banner Section */}
      {hasTopBanner && (
        <section className="container mx-auto mb-6">
          <TopBannerSections
            title={topBanner.title || ""}
            bgImage={topBanner.imageUrl || ""}
            text={topBanner.text || ""}
            viewLink={topBanner.buttonLink || ""}
          />
        </section>
      )}

      {/* 🔹 Main Content Area */}
      <div className="main-content flex flex-col lg:flex-row gap-5 relative min-h-[400px]">
        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            hasSidebar && sidebarVisible ? "lg:w-[75%]" : "w-full"
          }`}
        >
          <section
            className="
              bg-[var(--background)] text-[var(--foreground)]
              transition-colors duration-300 rounded-xl
            "
          >
            {children}
          </section>
        </div>

        {/* Sidebar */}
        {hasSidebar && (
          <div className="relative">
            <div className="flex justify-end mb-2 sticky top-30 z-10">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="
                  text-[var(--foreground)] hover:text-[var(--main-orange)]
                  cursor-pointer transition rounded-full
                  bg-[var(--footer-bg)] p-3
                "
                aria-label="Toggle sidebar"
              >
                {sidebarVisible ? (
                  <FiX className="text-2xl" />
                ) : (
                  <FiSidebar className="text-2xl" />
                )}
              </button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out ${
                sidebarVisible
                  ? "w-full lg:w-70 max-h-250 overflow-y-auto block"
                  : "w-0 hidden overflow-hidden"
              }`}
            >
              <SideBar sidebar={sidebar} />
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Middle Banner Section */}
      {hasMiddleBanner && (
        <section className="container mx-auto mt-8">
          <MiddelBanner
            title={middleBanner.title || ""}
            bgImage={middleBanner.imageUrl || ""}
            text={middleBanner.text || ""}
            viewLink={middleBanner.buttonLink || ""}
          />
        </section>
      )}
    </div>
  );
}
