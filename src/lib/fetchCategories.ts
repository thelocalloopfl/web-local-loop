import { client } from '../../lib/sanity';

export type Category = {
  _id: string;
  title: string;
};

export async function fetchCategories(): Promise<Category[]> {
  const query = `*[_type == "eventCategory"]{
    _id,
    title
  } | order(title asc)`;
  
  const categories = await client.fetch(query, {});

  const uniqueCategories = categories.filter(
    (cat: Category, index: number, self: Category[]) =>
      index === self.findIndex(c => c.title === cat.title)
  );

  return uniqueCategories;
}
