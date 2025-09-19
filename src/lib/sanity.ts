import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Rename from config → sanityConfig
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,      
  dataset: 'production',
  apiVersion: '2025-07-31',
  useCdn: false,
};

// Client for read operations
export const sanityClient = createClient(sanityConfig);

// Secure client for server-side write operations
export const writeClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Image builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
