import {createClient} from '@sanity/client';
import {loadQuery, setServerClient} from './sanity.loader';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'rimuhevv',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-10-28',
  // useCdn: process.env.NODE_ENV === 'production',
  useCdn: false,
  stega: {
    enabled: true,
    studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
  },
});

setServerClient(client);

export {loadQuery};
