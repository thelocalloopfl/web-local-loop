import { client } from "../../../lib/sanity";

export type AdItem = {
  _id: string;
  title: string;
  imageUrl: string;
  href: string;
  isActive: boolean;
};

export async function fetchFeaturedAds(): Promise<AdItem[]> {
  const now = new Date().toISOString();

  const query = `
    *[_type == "adPlacement" 
      && tier == "featured" 
      && isActive == true 
      && start <= $now 
      && end >= $now] 
      | order(_createdAt asc){
        _id,
        title,
        "imageUrl": image.asset->url,
        href,
        isActive
      }
  `;

  return await client.fetch(query, { now });
}
