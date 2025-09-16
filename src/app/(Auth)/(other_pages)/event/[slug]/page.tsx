import { fetchEventBySlug } from "@/lib/fetchEventBySlug";
import type { Metadata } from "next";
import Image from "next/image";

interface EventPageProps {
    params: Promise<{ slug: string }>;
}

// ✅ Metadata for SEO
export async function generateMetadata(
    { params }: EventPageProps
): Promise<Metadata> {
    const { slug } = await params;
    const event = await fetchEventBySlug(slug);

    if (!event) {
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

// ✅ Page Component
export default async function EventPage({ params }: EventPageProps) {
    const { slug } = await params;
    const event = await fetchEventBySlug(slug);

    if (!event) {
        return (
            <div className="main-content mx-auto px-5 text-center text-3xl pb-16 text-black max-w-7xl">
                Event not found
            </div>
        );
    }

    return (
        <article className="main-content mx-auto pb-16 text-black max-w-4xl">
            {/* 🟠 Header */}
            <header className="mb-10">
                <h1 className="text-3xl md:text-5xl font-bold text-orange-700 mb-3 capitalize">
                    {event.title}
                </h1>

                {/* Categories */}
                {event.categories && event.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {event.categories.map((cat) => (
                            <span
                                key={cat._id}
                                className="px-3 py-1 rounded-full border bg-gray-100 border-gray-300 text-sm text-gray-700"
                            >
                                {cat.title}
                            </span>
                        ))}
                    </div>
                )}

                {/* Date */}
                <div className="mb-4 mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
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
                            className="object-cover rounded-xl shadow"
                            priority
                        />
                    </div>
                )}
            </header>

            {/* 🟠 Body */}
            <section className="prose max-w-none text-gray-800">
                <p>{event.description}</p>
            </section>
        </article>

    );
}
