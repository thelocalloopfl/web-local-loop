// src/lib/fetchEventBySlug.ts
import { client } from "../../lib/sanity";

export interface EventItem {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  publishedAt: string;
  image?: string;
  categories?: { _id: string; title: string }[];
}

export async function fetchEventBySlug(slug: string): Promise<EventItem | null> {
  const query = `*[_type == "event" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    publishedAt,
    "image": image.asset->url,
    categories[]->{_id, title}
  }`;

  return await client.fetch(query, { slug });
}
