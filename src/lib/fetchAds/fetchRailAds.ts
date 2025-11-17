import { client } from "../../../lib/sanity";
import type { AdItem } from "./fetchFeaturedAds";

export async function fetchRailAds(): Promise<AdItem[]> {
  const now = new Date().toISOString();

  const query = `
    *[_type == "adPlacement" 
      && tier == "rail" 
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
