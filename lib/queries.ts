// lib/sanity-queries.ts
import { client } from './sanity';

export async function fetchEvents() {
  // 1. Calculate the ISO string for 24 hours ago
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString();

  // 2. Use a parameter ($yesterday) in the query
  const query = `*[_type == "event" && publishedAt >= $yesterday] | order(publishedAt asc){
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

  // 3. Pass the calculated date as a parameter
  const params = { yesterday: yesterdayISO };

  return await client.fetch(query, params, { next: { revalidate: 30 } });
}

export async function fetchCategories() {
  const query = `*[_type == "category"]{ _id, title }`;
  return await client.fetch(query, {}, { next: { revalidate: 30 } });
}