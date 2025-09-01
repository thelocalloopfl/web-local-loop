import { client } from '../lib/sanity';

export interface EventItem {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  publishedAt: string;
  image?: string;
  categories?: { _id: string; title: string }[];
}

export async function fetchEvents(): Promise<EventItem[]> {
  const query = `*[_type == "event"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    publishedAt,
    "image": image.asset->url,
    categories[]->{_id, title}
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 30 } });
}