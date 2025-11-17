import { client } from "../../../lib/sanity";

export type Banner = {
  _id: string;
  title: string;
  imageUrl: string;
  href: string;
  start: string;
  end: string;
  isActive: boolean;
};

export async function fetchTopBanner(): Promise<Banner | null> {
  const now = new Date().toISOString();

  const query = `
    *[_type == "adPlacement" 
      && tier == "banner-top" 
      && isActive == true 
      && start <= $now 
      && end >= $now] 
      | order(_createdAt asc)[0]{
        _id,
        title,
        "imageUrl": image.asset->url,
        href,
        start,
        end,
        isActive
      }
  `;

  return await client.fetch(query, { now });
}
