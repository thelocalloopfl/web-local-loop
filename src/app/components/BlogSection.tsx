
'use client';
import { Blog } from "../../lib/fetchBlogs";
import { BlogCategory } from "../../lib/fetchBlogCategories";
import BlogListWithLoadMore from "./BlogListWithLoadMore";

export default function BlogSection({ allBlogs, categories }: { allBlogs: Blog[], categories: BlogCategory[] }) {
  return <BlogListWithLoadMore allBlogs={allBlogs} categories={categories} />;
}
