"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { EventItem } from "../../../types/event";

type Category = {
  _id: string;
  title: string;
};

export default function EventListWithLoadMore({
  allEvents,
  categories = [],
  all,
}: {
  allEvents: EventItem[];
  categories?: Category[];
  all?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("soonest");
  const [showCategories, setShowCategories] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const handleLoadMore = () => {
    startTransition(() => setVisibleCount((prev) => prev + 3));
  };

  // --- FILTER + SORT ---
  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((event) => {
        const matchesSearch = event.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          !selectedCategory ||
          (event.categories ?? []).some((cat) => cat._id === selectedCategory);
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "soonest") {
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        } else {
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        }
      });
  }, [allEvents, search, selectedCategory, sortBy]);

  const events = filteredEvents.slice(0, visibleCount);
  const allLoaded = visibleCount >= filteredEvents.length;

  return (
    <main
      className="
        mx-auto max-w-7xl px-4 py-10 
        bg-[var(--background)] text-[var(--foreground)] 
        transition-colors duration-300
      "
    >
      {/* Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 mb-10">
        {/* Search */}
        <div className="relative w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(3);
            }}
            className="
              w-full border border-gray-300 dark:border-gray-700 
              rounded-xl px-4 py-2 pl-10 text-base md:text-lg 
              focus:outline-none focus:ring-2 focus:ring-orange-400
              bg-[var(--background)] text-[var(--foreground)] 
              transition-colors duration-300
            "
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
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

        {/* Filter */}
        <div className="relative">
          <button
            type="button"
            className="
              w-full md:text-lg px-4 py-2 border border-orange-700 rounded-xl font-semibold 
              bg-[var(--background)] text-orange-700 dark:text-orange-400 dark:border-orange-500 
              hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 transition duration-200
              flex items-center justify-center gap-1
            "
            onClick={() => setShowCategories((v) => !v)}
          >
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
                d="M3 4h18M4 8h16M6 12h12M9 16h6"
              />
            </svg>
            Filter by Category
          </button>
          {showCategories && (
            <div
              className="
                absolute z-10 mt-2 w-full bg-[var(--background)] 
                border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl 
                max-h-60 overflow-y-auto transition-colors duration-200
              "
            >
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-orange-200 dark:hover:bg-gray-800 ${
                  selectedCategory === null
                    ? "font-bold text-orange-700 dark:text-orange-500"
                    : "hover:text-black"
                }`}
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategories(false);
                  setVisibleCount(3);
                }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`block w-full text-left px-4 py-2 hover:bg-orange-200 dark:hover:bg-gray-800 ${
                    selectedCategory === cat._id
                      ? "font-bold text-orange-700 dark:text-orange-500"
                      : "hover:text-black"
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    setShowCategories(false);
                    setVisibleCount(3);
                  }}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sort By */}
      <div className="flex mb-8 relative">
        <button
          type="button"
          className="
            px-4 py-2 border border-orange-700 rounded-xl text-orange-700 dark:text-orange-400 
            bg-[var(--background)] hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 
            text-sm font-semibold transition flex items-center gap-2
          "
          onClick={() => setShowSort((v) => !v)}
        >
          {sortBy === "soonest" ? "Soonest" : "Newest"}
        </button>
        {showSort && (
          <div
            className="
              absolute z-10 mt-10 bg-[var(--background)] 
              border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl 
              overflow-hidden
            "
          >
            {["soonest", "newest"].map((option) => (
              <button
                key={option}
                className={`block w-full  px-4 py-2 text-sm text-center hover:bg-orange-200 ${
                  sortBy === option
                    ? "font-bold text-orange-700 dark:text-orange-500"
                    : "hover:text-black"
                }`}
                onClick={() => {
                  setSortBy(option);
                  setShowSort(false);
                }}
              >
                {option === "soonest" ? "Soonest" : "Newest"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {events.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg py-12">
            No events found.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="
                bg-[var(--background)] border border-gray-200 dark:border-gray-700
                shadow-md rounded-2xl overflow-hidden flex flex-col 
                hover:shadow-lg hover:border-orange-400 dark:hover:border-orange-500 
                transition-all duration-300
              "
            >
              {event.image && (
                <Image
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={300}
                  className="w-full h-44 object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(event.categories ?? []).map((cat) => (
                    <span
                      key={cat._id}
                      className="text-xs font-medium text-orange-700 dark:text-orange-400"
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {event.title}
                </h3>
                <p className="text-xs md:text-sm opacity-70 mb-2">
                  {new Date(event.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <Link
                  href={
                    event.slug?.current ? `/event/${event.slug.current}` : "#"
                  }
                  className="
                    inline-flex items-center gap-1 text-orange-700 dark:text-orange-400 
                    font-semibold mt-auto hover:gap-2 transition-all duration-200
                  "
                  prefetch={false}
                >
                  View Details
                  <FiArrowRight className="text-lg" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More / View All */}
      {all ? (
        !allLoaded && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="
                px-6 py-3 bg-orange-700 text-white rounded-xl font-medium text-base 
                flex items-center gap-2 min-w-[180px] justify-center 
                hover:bg-transparent hover:text-orange-700 dark:hover:text-orange-400 
                border border-orange-700 transition disabled:opacity-50
              "
            >
              {isPending ? "Loading..." : "Load More"}
            </button>
          </div>
        )
      ) : (
        <div className="flex justify-center">
          <Link
            href="/event"
            className="
              px-6 py-3 bg-orange-700 text-white rounded-xl font-medium text-base 
              flex items-center gap-2 min-w-[200px] justify-center 
              hover:bg-transparent hover:text-orange-700 dark:hover:text-orange-400 
              border border-orange-700 transition
            "
          >
            View All Events
          </Link>
        </div>
      )}
    </main>
  );
}
