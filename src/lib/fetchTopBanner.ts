import { client } from '../../lib/sanity';

export type TopBanner = {
  _id: string;
  title: string;
  imageUrl: string;
  text: string;
  buttonLink: string;
  createdAt: string;
};

export async function fetchTopBanner(): Promise<TopBanner> {

    // 1. Calculate the ISO string for 24 hours ago
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString();

  const query = `
    *[_type == "topBanner" && createdAt >= $yesterday] 
      | order(_createdAt asc)[0] {
        _id,
        title,
        "imageUrl": bannerImage.asset->url,
        text,
        buttonLink
      }
  `;
  
  // 3. Pass the calculated date as a parameter
  const params = { yesterday: yesterdayISO };

  return await client.fetch(query, params, {});
}
