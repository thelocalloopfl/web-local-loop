import { client } from '../../lib/sanity'

export type DirectoryListing = {
  _id: string
  name: string
  slug?: { current: string }
  category?: string
  blurb?: string
  url?: string
  email?: string
  phone?: string
  logo?: string
  featureImage?: string
  tier: 'hero' | 'pro' | 'standard' | 'basic' | 'free'
  isActive?: boolean
  start?: string
  end?: string
}

/**
 * Fetch all active directory listings
 */
export async function fetchActiveBusinesses(): Promise<DirectoryListing[]> {
  const query = `*[
    _type == "directoryListing" &&
    isActive == true
  ] | order(name asc) {
    _id,
    name,
    "slug": slug,
    category,
    blurb,
    url,
    email,
    phone,
    "logo": logo.asset->url,
    "featureImage": featureImage.asset->url,
    tier,
    isActive,
    start,
    end
  }`

  return await client.fetch(query)
}
