import { client } from '../../lib/sanity';

export type SpotlightCategory = {
  _id: string;
  title: string;
};

export async function fetchSpotlightCategories(): Promise<SpotlightCategory[]> {
  const query = `*[_type == "spotlightCategory"]{_id, title}`;
  return await client.fetch(query, {}, { next: { revalidate: 30 } });
}
