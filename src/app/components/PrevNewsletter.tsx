"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface Newsletter {
  title: string;
  link: string;
  date?: string;
  snippet?: string;
  image?: string;
}

export default function PrevNewsletter() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletters")
      .then((res) => res.json())
      .then((data: Newsletter[]) => {
        setNewsletters(data || []);
      })
      .catch(() => setNewsletters([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = () => {
    startTransition(() => setVisibleCount((prev) => prev + 3));
  };

  const filtered = Array.isArray(newsletters)
    ? newsletters.filter(
        (n) =>
          n.title?.toLowerCase().includes(search.toLowerCase()) ||
          (n.date && n.date.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const visibleNewsletters = filtered.slice(0, visibleCount);
  const allLoaded = visibleCount >= filtered.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search */}
      <div className="mb-8 relative w-full">
        <input
          type="text"
          placeholder="Search newsletters..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(3);
          }}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 pl-10 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </span>
      </div>

      {/* Newsletter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mb-8">
        {loading ? (
          <div className="col-span-full text-center text-orange-500 py-12">
            Loading...
          </div>
        ) : visibleNewsletters.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            No newsletters found.
          </div>
        ) : (
          visibleNewsletters.map((n, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition duration-200"
            >
              {n.image && (
                <img
                  src={n.image}
                  alt={n.title}
                  className="w-full h-44 object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-grow">
                {n.date && (
                  <p className="text-xs md:text-sm text-gray-500 mb-2">
                    {new Date(n.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
                  {n.title}
                </h3>
                {n.snippet && (
                  <p className="text-sm text-gray-600 flex-grow mb-4">
                    {n.snippet.split(" ").slice(0, 12).join(" ")}
                    {n.snippet.split(" ").length > 12 && "..."}
                  </p>
                )}
                <Link
                  href={n.link}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-orange-500 font-semibold mt-auto hover:gap-3 transition-all duration-200"
                >
                  View Newsletter
                  <FiArrowRight className="text-lg" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {!loading && !allLoaded && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-transparent hover:text-orange-500 border border-orange-500 transition disabled:opacity-50 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Load More Newsletters"}
          </button>
        </div>
      )}
    </div>
  );
}
