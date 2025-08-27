import {defineCliConfig} from 'sanity/cli';

// Hardcoded Sanity CLI configuration
// Project IDs are not sensitive information - they're visible in API URLs
export default defineCliConfig({
  api: {
    projectId: 'rimuhevv', // Not sensitive - hardcoded for stability
    dataset: 'production',
  },
  studioHost: 'localhost',
});
