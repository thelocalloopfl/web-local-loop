import { client } from '../../lib/sanity';

export type Spotlight = {
  _id: string;
  title: string;
  image?: string;
  description: string;
  offerText?: string;
  websiteUrl: string;
  category?: { _id: string; title: string };
};

export async function fetchSpotlights(): Promise<Spotlight[]> {
  const query = `*[_type == "spotlight"]|order(_createdAt desc){
    _id,
    title,
    "image": image.asset->url,
    description,
    offerText,
    websiteUrl,
    category->{_id, title}
  }`;
  return await client.fetch(query);
}
