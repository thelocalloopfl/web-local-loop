import { client } from "../../../lib/sanity";

import type { Banner } from "./fetchTopBanner";

export async function fetchBottomBanner(): Promise<Banner | null> {
  const now = new Date().toISOString();

  const query = `
    *[_type == "adPlacement" 
      && tier == "banner-bottom" 
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
