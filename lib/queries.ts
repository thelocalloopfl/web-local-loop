// lib/sanity-queries.ts
import { client } from './sanity';

export async function fetchEvents() {
  const query = `*[_type == "event"] | order(publishedAt desc){
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
  return await client.fetch(query);
}

export async function fetchCategories() {
  const query = `*[_type == "category"]{ _id, title }`;
  return await client.fetch(query);
}