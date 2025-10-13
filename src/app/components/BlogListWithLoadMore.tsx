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
    startTransition(() => {
      setVisibleCount((prev) => prev + 3);
    });
  };

  // Filter blogs by search and category
  const filteredBlogs = allBlogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || blog.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const blogs = filteredBlogs.slice(0, visibleCount);
  const allLoaded = visibleCount >= filteredBlogs.length;

  return (
    <>
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

        {/* Filter */}
        <div className="relative">
          <button
            type="button"
            className="w-full md:text-lg px-4 py-2 border border-orange-700 rounded-xl text-orange-700 font-semibold bg-white hover:bg-orange-800 hover:text-white transition flex items-center justify-center gap-2"
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
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedCategory === null ? "font-bold text-orange-700" : ""
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
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedCategory === cat._id
                      ? "font-bold text-orange-700"
                      : ""
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

      {/* Blog Grid (styled like directory) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-12">
            No Blog Found
          </div>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition duration-200"
            >
            {blog.image ? (
              <Image
                src={blog.image}
                alt={blog.title}
                width={600}
                height={300}
                className="w-full h-44 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-44 bg-gray-300 flex items-center justify-center rounded-md">
                <span className="text-gray-600 text-sm">No Image Available</span>
              </div>
            )}
              <div className="p-5 flex flex-col flex-grow">
                {blog.category && (
                  <span className="text-xs font-medium text-orange-700 mb-2">
                    {blog.category.title}
                  </span>
                )}
                <div className=" flex gap-3 text-orange-700 text-xs mb-2">
                  <p>
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p >
                    By {blog.author || "Unknown"}
                  </p>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 flex-grow mb-4">
                  {blog.description.split(" ").slice(0, 20).join(" ")}
                  {blog.description.split(" ").length > 20 && "..."}
                </p>
                <Link
                  href={`/blog/${blog._id}`}
                  className="inline-flex items-center gap-1 text-orange-700 font-semibold mt-auto hover:gap-2 transition-all duration-200"
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
              className="px-6 py-3 bg-orange-700 text-white rounded-xl font-medium ttext-base flex items-center gap-2 min-w-[180px] justify-center hover:bg-transparent hover:text-orange-800 border border-orange-700 transition disabled:opacity-50 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Load More"}
            </button>
          </div>
        )
      ) : (
        <div className="flex justify-center">
          <Link
            href="/blog"
            className="px-6 py-3 bg-orange-700 text-white rounded-xl font-medium text-base flex items-center gap-2 min-w-[200px] justify-center hover:bg-transparent hover:text-orange-800 border border-orange-700 transition"
          >
            View All Blogs
          </Link>
        </div>
      )}
    </>
  );
}
