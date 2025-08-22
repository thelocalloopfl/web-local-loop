import { client } from "../../lib/sanity";

export type Blog = {
  _id: string;
  title: string;
  publishedAt: string;
  imageUrl: string;
  category?: {
    _id: string;
    title: string;
  };
  body: unknown[];
  author:string;
};

export async function fetchBlogById(id: string): Promise<Blog | null> {
  const query = `
    *[_type == "blog" && _id == $id][0]{
      _id,
      title,
      publishedAt,
      "imageUrl": image.asset->url,
      category->{
        _id,
        title
      },
      body,
      author
    }
  `;

  return await client.fetch(query, { id }, { next: { revalidate: 30 } });
}
