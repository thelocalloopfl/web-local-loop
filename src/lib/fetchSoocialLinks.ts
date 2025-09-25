import { client } from '../../lib/sanity';

export type SocialLinks = {
  facebook: string;
  instagram: string;
  x: string;
};

export async function fetchSocilLinks(): Promise<SocialLinks> {
  const query = `
    *[_type == "sociallinks"] 
      | order(_createdAt desc)[0] {
        facebook,
        instagram,
        x
      }
  `;
  
  return await client.fetch(query, {});
}
