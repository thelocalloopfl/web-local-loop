// lib/sanity-queries.ts
import { client } from './sanity';

export async function fetchEvents() {
  const query = `*[_type == "event" && publishedAt >= now()] | order(publishedAt asc){
    _id,
    title,
    slug,
    description,
    publishedAt,
    "image": image.asset->url,
    categories[]->{
      _id,
      title
    }
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 30 } });
}

export async function fetchCategories() {
  const query = `*[_type == "category"]{ _id, title }`;
  return await client.fetch(query, {}, { next: { revalidate: 30 } });
}