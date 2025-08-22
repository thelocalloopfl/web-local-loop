import { fetchBlogById } from "@/lib/fetchBlogById";
import BlogContent from "../../../components/BlogContent";
import type { PortableTextBlock } from "@portabletext/types";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;
  const blog = await fetchBlogById(id);

  if (!blog) {
    return (
      <div className="main-content mx-auto px-5 text-center text-3xl pb-16 text-black max-w-7xl">
        Blog not found
      </div>
    );
  }

  return (
    <article className="main-content mx-auto pb-16 text-black max-w-4xl">
      {/* 🟠 Header Section */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-orange-600 mb-3 capitalize">
          {blog.title}
        </h1>
        <div className="mb-4  mt-8 ">
           {blog.category?.title && (
            <span className="px-3 py-1 rounded-full border bg-gray-100 border-gray-300">
              {blog.category.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>
            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        <span>
            By <span className="text-orange-500 font-semibold">{blog.author || "Unknown"}</span>
        </span>

        </div>
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-xl shadow mt-6"
        />
      </header>

      {/* 🟠 Body Section */}
      <section>
        <BlogContent value={blog.body as PortableTextBlock[]} />
      </section>
    </article>
  );
}
