import { createClient } from '@sanity/client';

export const config = {
  projectId: 'h0p4hnwf',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-07-31',
};

export const client = createClient(config);
