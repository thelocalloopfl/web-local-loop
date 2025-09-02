import { client } from '../../lib/sanity';

export type Blog = {
  _id: string;
  title: string;
  image?: string;
  publishedAt: string;
  category?: { _id: string; title: string };
  description: string;
  author: string;
  slug: { current: string };
};

export async function fetchBlogs(): Promise<Blog[]> {
  const query = `*[_type == "blog"]|order(publishedAt desc){
    _id,
    title,
    "image": image.asset->url,
    publishedAt,
    description,
    author,
    slug,
    category->{_id, title}
  }`;
  return await client.fetch(query, {});
}
