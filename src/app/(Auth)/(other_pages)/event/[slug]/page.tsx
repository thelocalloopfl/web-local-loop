import { fetchEventBySlug } from "@/lib/fetchEventBySlug";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

// An event page is public only while the event is upcoming (or ended within the
// last day). This mirrors the events listing, which hides past events, so stale
// or seed events are not reachable via a direct URL.
function isEventVisible(publishedAt?: string): boolean {
  if (!publishedAt) return false;
  const eventDate = new Date(publishedAt);
  if (Number.isNaN(eventDate.getTime())) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 1);
  return eventDate >= cutoff;
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ SEO Metadata
export async function generateMetadata(
  { params }: EventPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event || !isEventVisible(event.publishedAt)) {
    return {
      title: "Event Not Found | The Local Loop FL",
      description: "The requested event could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${event.title} | The Local Loop FL`;
  const description =
    event.description ||
    `Join us for "${event.title}" in Winter Garden — check details, timings, and venue.`;

  const imageUrl =
    event.image || "https://thelocalloopfl.com/default-logo.png";
  const url = `https://thelocalloopfl.com/event/${slug}`;

  return {
    title,
    description,
    keywords: [
      event.title,
      event.categories?.[0]?.title || "Winter Garden events",
      "community events Winter Garden",
      "The Local Loop events",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "The Local Loop FL",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: event.title }],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

// ✅ Dark/Light Themed Page
export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event || !isEventVisible(event.publishedAt)) {
    notFound();
  }

  return (
    <article
      className="
        main-content mx-auto pb-16 px-5 max-w-4xl
        text-[var(--foreground)] bg-[var(--background)]
        transition-colors duration-300
      "
    >
      {/* 🟠 Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--main-orange)] mb-3 capitalize">
          {event.title}
        </h1>

        {/* Categories */}
        {event.categories && event.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.categories.map((cat) => (
              <span
                key={cat._id}
                className="
                  px-3 py-1 rounded-full border text-sm
                  border-gray-300 dark:border-gray-700
                  bg-gray-100 dark:bg-[#1a1a1a]
                  text-gray-700 dark:text-gray-300
                  transition-colors duration-300
                "
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <div className="mb-4 mt-6 flex flex-wrap gap-4 text-sm text-[var(--muted-text)]">
          <time className="font-medium">
            {new Date(event.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {/* Featured Image */}
        {event.image && (
          <div className="relative w-full h-96 mt-6">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all"
              priority
            />
          </div>
        )}
      </header>

      {/* 🟠 Event Description */}
      <section
        className="
          prose prose-lg max-w-none
          text-[var(--foreground)]
          prose-headings:text-[var(--foreground)]
          prose-p:text-[var(--foreground)]
          prose-strong:text-[var(--foreground)]
          prose-a:text-[var(--main-orange)]
          prose-blockquote:border-[var(--main-orange)]
          transition-colors duration-300
        "
      >
        <p>{event.description}</p>
      </section>
    </article>
  );
}
