import { fetchBlogById } from "@/lib/fetchBlogById";
import BlogContent from "../../../../components/BlogContent";
import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";
import Image from "next/image";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await fetchBlogById(id);

  const defaultImage = "https://thelocalloopfl.com/default-blog.jpg";

  if (!blog) {
    return {
      title: "Blog Not Found | The Local Loop FL",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = blog.title;
  const description =
    blog.description ||
    `Read "${blog.title}" on The Local Loop FL — your source for Winter Garden community stories, restaurant reviews, and local events.`;
  const imageUrl = blog.imageUrl || defaultImage;
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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }],
      locale: "en_US",
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;
  const blog = await fetchBlogById(id);
  const defaultImage = "/default-blog.jpg";

  if (!blog) {
    return (
      <div
        className="
          main-content mx-auto text-center text-3xl pb-16
          text-[var(--foreground)] bg-[var(--background)]
          transition-colors duration-300 max-w-7xl
        "
      >
        Blog not found
      </div>
    );
  }

  const imageToUse = blog.imageUrl || defaultImage;

  return (
    <article
      className="
        main-content mx-auto pb-16 max-w-4xl
        bg-[var(--background)] text-[var(--foreground)]
        transition-colors duration-300
      "
    >
      {/* 🟠 Header Section */}
      <header className="mb-10">
        <h1
          className="
            text-3xl md:text-5xl font-bold mb-3 capitalize
            text-[var(--main-orange)]
          "
        >
          {blog.title}
        </h1>

        {/* Category */}
        {blog.category?.title && (
          <div className="mb-4 mt-8">
            <span
              className="
                px-3 py-1 rounded-full border
                bg-[var(--footer-bg)] border-[var(--border-color)]
                text-[var(--foreground)]
              "
            >
              {blog.category.title}
            </span>
          </div>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-[var(--muted-text)]">
          <time>
            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>
            By{" "}
            <span className="text-[var(--main-orange)] font-semibold">
              {blog.author || "Unknown"}
            </span>
          </span>
        </div>

        {/* Hero Image (with fallback) */}
        <div className="relative w-full h-96 mt-6">
          <Image
            src={imageToUse}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover rounded-xl shadow"
            priority
          />
        </div>
      </header>

      {/* 🟠 Body Section */}
      <section>
        <BlogContent value={blog.body as PortableTextBlock[]} />
      </section>
    </article>
  );
}
