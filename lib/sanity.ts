import { createClient } from '@sanity/client';

export const config = {
  projectId: 'n7w5gf77',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-07-31',
};

export const client = createClient(config);
