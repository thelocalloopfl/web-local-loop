import { client } from '../../lib/sanity';

export type BlogCategory = {
  _id: string;
  title: string;
};

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const query = `*[_type == "blogCategory"]{_id, title}`;
  return await client.fetch(query, {}, { next: { revalidate: 30 } });
}
