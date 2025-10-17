"use client";
import React from "react";
import Link from "next/link";

interface MiddelBannerProps {
  title: string;
  bgImage: string;
  text: string;
  viewLink?: string;
}

const MiddelBanner: React.FC<MiddelBannerProps> = ({
  title,
  bgImage,
  text,
  viewLink = "#",
}) => {
  const trimmedText = text.length > 100 ? text.substring(0, 100) + "..." : text;
  return (
    <section
      className="relative w-full max-w-[1200px] mx-auto rounded-2xl overflow-hidden group"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Stylish overlay with gradient and blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70 backdrop-blur-[3px] transition-all duration-500 group-hover:backdrop-blur-[6px]"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 px-6 sm:px-10 py-10 sm:py-14 text-center sm:text-left">
        {/* Text Section */}
        <div className="flex-1">
          <h2 className="text-white text-3xl sm:text-4xl font-bold leading-tight tracking-tight drop-shadow-md">
            {title}
          </h2>
          <p className="text-white/80 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
            {trimmedText}
          </p>
        </div>

        {/* Button Section */}
        <div className="flex-shrink-0">
          <Link
            href={viewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Explore Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Thin neon edge for premium touch */}
      <div className="absolute inset-0 border border-yellow-500/30 rounded-2xl group-hover:border-yellow-400/50 transition-all duration-300"></div>

      {/* Subtle animated gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
    </section>
  );
};

export default MiddelBanner;
