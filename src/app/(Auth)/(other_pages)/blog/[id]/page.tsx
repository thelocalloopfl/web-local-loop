import { fetchBlogById } from "@/lib/fetchBlogById";
import BlogContent from "../../../../components/BlogContent";
import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: BlogPageProps
): Promise<Metadata> {
  const { id } = await params;
  const blog = await fetchBlogById(id);

  if (!blog) {
    return {
      title: "Blog Not Found | The Local Loop FL",
      description: "The requested blog post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${blog.title}`;

  const description =
    blog.description ||
    `Read "${blog.title}" on The Local Loop FL — your source for Winter Garden community stories, restaurant reviews, and local events.`;

  const imageUrl =
    blog.imageUrl || "https://thelocalloopfl.com/default-logo.png";

  const url = `https://thelocalloopfl.com/blog/${id}`;

  return {
    title,
    description,
    keywords: [
      blog.title,
      blog.category?.title || "Winter Garden blog",
      "Winter Garden community",
      "local news Winter Garden",
      "The Local Loop blog",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "The Local Loop FL",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
        <h1 className="text-3xl md:text-5xl font-bold text-orange-700 mb-3 capitalize">
          {blog.title}
        </h1>
        <div className="mb-4 mt-8">
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
            By{" "}
            <span className="text-orange-700 font-semibold">
              {blog.author || "Unknown"}
            </span>
          </span>
        </div>

        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-xl shadow mt-6"
          />
        )}
      </header>

      {/* 🟠 Body Section */}
      <section>
        <BlogContent value={blog.body as PortableTextBlock[]} />
      </section>
    </article>
  );
}
