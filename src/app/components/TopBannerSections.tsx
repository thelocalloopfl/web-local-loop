"use client";
import React from "react";
import Link from "next/link";

interface TopBannerSectionsProps {
  title: string;
  bgImage: string;
  text: string;
  viewLink?: string;
}

const TopBannerSections: React.FC<TopBannerSectionsProps> = ({
  title,
  bgImage,
  text,
  viewLink = "https://google.com",
}) => {
  const trimmedText = text?.length > 120 ? text.substring(0, 120) + "..." : text;

  return (
    <section
      className="relative w-full max-w-[1200px] mx-auto mb-5 rounded-2xl overflow-hidden group sm:h-56 flex flex-col justify-between shadow-xl"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30 backdrop-blur-[2px] group-hover:backdrop-blur-[4px] transition-all duration-500"></div>

      {/* Top content */}
      <div className="relative z-10 px-8 sm:px-12 pt-6 text-left">
        <h2 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight drop-shadow-lg leading-snug">
          {title}
        </h2>
        <p className="text-white/85 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
          {trimmedText}
        </p>
      </div>

      {/* Bottom-right button */}
      <div className="relative z-10 flex justify-end px-8 sm:px-12 pb-6">
        <Link
          href={viewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white/10 text-white text-sm sm:text-base font-medium border border-white/20 backdrop-blur-md hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300 shadow-lg"
        >
          View More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>

      {/* Subtle ambient border glow */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300"></div>

      {/* Animated gradient edge for luxury effect */}
      <div className="absolute -bottom-[1px] inset-x-0 h-[3px] bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
    </section>
  );
};

export default TopBannerSections;
