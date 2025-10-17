"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AdItem {
  title: string;
  _id: string;
  imageUrl: string;
  text: string;
  buttonLink?: string;
}

interface SideBarProps {
  sidebar: AdItem[];
}

const SideBar: React.FC<SideBarProps> = ({ sidebar }) => {
  return (
    <aside className="flex flex-row lg:flex-col gap-5 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto lg:overflow-y-auto">
      {sidebar.map((item) => (
        <div
          key={item._id}
          className="relative group bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 w-60 lg:w-full flex-shrink-0"
        >
          {/* Ad Image */}
          <div className="relative h-36 sm:h-44 w-full">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <h3 className="text-white text-base font-semibold drop-shadow-md mb-1">
              {item.title.length > 40
                ? item.title.slice(0, 40) + "..."
                : item.title}
            </h3>
            <p className="text-white/80 text-xs mb-3 line-clamp-2">
              {item.text.length > 60 ? item.text.slice(0, 60) + "..." : item.text}
            </p>

            <div className="flex justify-end">
              <Link
                href={item.buttonLink ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1.5 text-xs rounded-full font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
              >
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default SideBar;
