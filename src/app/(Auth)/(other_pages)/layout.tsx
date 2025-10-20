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

  // Fetch data once client-side
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

  // ✅ Skeleton loader (no white flash)
  if (loading) {
    return (
      <div className="animate-pulse min-h-screen flex flex-col gap-6 p-5 container mx-auto">
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 h-[400px] bg-gray-200 rounded-lg" />
          <div className="hidden lg:block w-[20%] h-[400px] bg-gray-200 rounded-lg" />
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
    <div className="relative">
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
          {children}
        </div>

        {/* Sidebar */}
        {hasSidebar && (
          <div
            className={`relative transition-all duration-300 ease-in-out ${
              sidebarVisible
                ? "lg:w-[25%] max-w-[350px] block"
                : "w-0 overflow-hidden"
            }`}
          >
            {/* Toggle Button */}
            <div className="flex justify-end mb-2 sticky top-5 z-10">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="text-gray-600 hover:text-orange-600 cursor-pointer transition rounded-full bg-orange-100 p-3"
                aria-label="Toggle sidebar"
              >
                {sidebarVisible ? (
                  <FiX className="text-2xl" />
                ) : (
                  <FiSidebar className="text-2xl" />
                )}
              </button>
            </div>

            {/* Sidebar Scroll Content */}
            <div className="max-h-300 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100 rounded-lg">
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
