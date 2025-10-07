import { client } from '../../lib/sanity';

export type DirectoryCategory = {
  _id: string;
  title: string;
};

export async function fetchDirectoryCategory(): Promise<DirectoryCategory[]> {
  const query = `*[_type == "directoryCategory"]{_id, title} | order(title asc)`;

  const categories = await client.fetch(query, {});

  // Remove duplicate titles
  const uniqueCategories = categories.filter(
    (cat: DirectoryCategory, index: number, self: DirectoryCategory[]) =>
      index === self.findIndex(c => c.title === cat.title)
  );

  return uniqueCategories;
}
