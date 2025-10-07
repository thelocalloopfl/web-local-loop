import { client } from '../../lib/sanity';

export type BlogCategory = {
  _id: string;
  title: string;
};

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const query = `*[_type == "blogCategory"]{_id, title} | order(title asc)`;

  const categories = await client.fetch(query, {});

  // Remove duplicate titles
  const uniqueCategories = categories.filter(
    (cat: BlogCategory, index: number, self: BlogCategory[]) =>
      index === self.findIndex(c => c.title === cat.title)
  );

  return uniqueCategories;
}
