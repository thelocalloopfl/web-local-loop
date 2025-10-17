

import { client } from '../../lib/sanity';

export type Sidebar = {
  _id: string;
  title: string;
  imageUrl: string;
  text: string;
  buttonLink: string;
  createdAt: string;
};

// If you want ALL sidebar documents
export async function fetchSideBar(): Promise<Sidebar[]> {

  // 1. Calculate the ISO string for 24 hours ago
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString();

  const query = `
    *[_type == "sidebar" && createdAt >= $yesterday]
    | order(_createdAt asc){
      _id,
      title,
      "imageUrl": sidebarimage.asset->url,
      text,
      buttonLink
    }
  `;
  
   // 3. Pass the calculated date as a parameter
  const params = { yesterday: yesterdayISO };

  return await client.fetch(query, params, {});
}
