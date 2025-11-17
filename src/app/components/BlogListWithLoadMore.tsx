"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import { Blog } from "../../lib/fetchBlogs";
import { BlogCategory } from "../../lib/fetchBlogCategories";

export default function BlogListWithLoadMore({
  allBlogs,
  categories = [],
  all,
}: {
  allBlogs: Blog[];
  categories?: BlogCategory[];
  all?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleLoadMore = () => {
    startTransition(() => setVisibleCount((prev) => prev + 3));
  };

  // --- Clean & sort blogs ---
  const validBlogs = allBlogs
    .filter(
      (blog) =>
        blog.title &&
        blog.description &&
        blog.publishedAt &&
        blog._id // required fields only
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  // --- Filter blogs ---
  const filteredBlogs = validBlogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || blog.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const blogs = filteredBlogs.slice(0, visibleCount);
  const allLoaded = visibleCount >= filteredBlogs.length;

  const defaultImage = "/default-blog.jpg";

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
            placeholder="Search blogs..."
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
            onClick={() => setShowCategories((v) => !v)}
            className="
              w-full md:text-lg px-4 py-2 border border-orange-700 rounded-xl font-semibold 
              bg-[var(--background)] text-orange-700 dark:text-orange-400 dark:border-orange-500 
              hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 
              transition duration-200 flex items-center justify-center gap-1
            "
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

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg py-12">
            No blogs found.
          </div>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="
                bg-[var(--background)] border border-gray-200 dark:border-gray-700
                shadow-md rounded-2xl overflow-hidden flex flex-col 
                hover:shadow-lg hover:border-orange-400 dark:hover:border-orange-500 
                transition-all duration-300
              "
            >
              <Image
                src={blog.image || defaultImage}
                alt={blog.title}
                width={600}
                height={300}
                className="w-full h-44 object-cover"
              />
              <div className="p-5 flex flex-col flex-grow">
                {blog.category && (
                  <span className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-2">
                    {blog.category.title}
                  </span>
                )}
                <div className="flex gap-3 text-orange-700 dark:text-orange-400 text-xs mb-2">
                  <p>
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>By {blog.author || "Unknown"}</p>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {blog.title}
                </h3>
                <p className="text-sm opacity-70 flex-grow mb-4">
                  {blog.description.split(" ").slice(0, 20).join(" ")}
                  {blog.description.split(" ").length > 20 && "..."}
                </p>
                <Link
                  href={`/blog/${blog._id}`}
                  className="
                    inline-flex items-center gap-1 text-orange-700 dark:text-orange-400 
                    font-semibold mt-auto hover:gap-2 transition-all duration-200
                  "
                >
                  Read More
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
            href="/blog"
            className="
              px-6 py-3 bg-orange-700 text-white rounded-xl font-medium text-base 
              flex items-center gap-2 min-w-[200px] justify-center 
              hover:bg-transparent hover:text-orange-700 dark:hover:text-orange-400 
              border border-orange-700 transition
            "
          >
            View All Blogs
          </Link>
        </div>
      )}
    </main>
  );
}
