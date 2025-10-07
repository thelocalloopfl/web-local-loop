import { client } from '../../lib/sanity';

export type SpotlightCategory = {
  _id: string;
  title: string;
};

export async function fetchSpotlightCategories(): Promise<SpotlightCategory[]> {
  const query = `*[_type == "spotlightCategory"]{_id, title} | order(title asc)`;

  const categories = await client.fetch(query, {});

  // Remove duplicate titles
  const uniqueCategories = categories.filter(
    (cat: SpotlightCategory, index: number, self: SpotlightCategory[]) =>
      index === self.findIndex(c => c.title === cat.title)
  );

  return uniqueCategories;
}
