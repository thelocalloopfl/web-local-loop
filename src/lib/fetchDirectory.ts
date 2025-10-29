import { client } from '../../lib/sanity';

export type Business = {
  _id: string;
  name: string;
  logo: string;
  featureImage: string;
  category?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  tier?: string;
  adLinkUrl?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
};

export async function fetchActiveBusinesses(): Promise<Business[]> {
  const query = `*[
    _type == "business" &&
    active == true
  ] | order(name asc) {
    _id,
    name,
    "logo": logo.asset->url,
    "featureImage": featureImage.asset->url,
    category,
    description,
    website,
    email,
    phone,
    tier,
    adLinkUrl,
    active,
    startDate,
    endDate
  }`;

  return await client.fetch(query);
}
