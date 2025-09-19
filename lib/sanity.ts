import { createClient } from '@sanity/client';

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-07-31',
};

export const client = createClient(sanityConfig);
