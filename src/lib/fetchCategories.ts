import { client } from '../../lib/sanity';

export type Category = {
  _id: string;
  title: string;
};

export async function fetchCategories(): Promise<Category[]> {
  const query = `*[_type == "eventCategory"]{_id, title}`;
  return await client.fetch(query);
}
