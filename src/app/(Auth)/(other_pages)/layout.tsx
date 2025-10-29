/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { FiSidebar, FiX } from "react-icons/fi";
import TopBannerSections from "../../components/TopBannerSections";
import MiddelBanner from "../../components/MiddelBanner";
import SideBar from "../../components/SideBar";

import { fetchTopBanner } from "@/lib/fetchTopBanner";
import { fetchMiddleBanner } from "@/lib/fetchMiddleBanner";
import { fetchSideBar } from "@/lib/fetchSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [topBanner, middleBanner, sidebar] = await Promise.all([
          fetchTopBanner(),
          fetchMiddleBanner(),
          fetchSideBar(),
        ]);
        setData({ topBanner, middleBanner, sidebar });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ✅ Skeleton loader with theme variables
  if (loading) {
    return (
      <div
        className="
          animate-pulse min-h-screen flex flex-col gap-6 p-5 container mx-auto
          bg-[var(--background)] text-[var(--foreground)]
        "
      >
        <div className="h-48 bg-[var(--skeleton-bg)] rounded-lg" />
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 h-[400px] bg-[var(--skeleton-bg)] rounded-lg" />
          <div className="hidden lg:block w-[20%] h-[400px] bg-[var(--skeleton-bg)] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { topBanner, middleBanner, sidebar } = data;

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
