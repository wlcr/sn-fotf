import {defineCliConfig} from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId:
      (process.env as Record<string, string | undefined>)
        .PUBLIC_SANITY_PROJECT_ID ||
      (process.env as Record<string, string | undefined>).SANITY_PROJECT_ID ||
      'your-project-id',
    dataset:
      (process.env as Record<string, string | undefined>)
        .PUBLIC_SANITY_DATASET ||
      (process.env as Record<string, string | undefined>).SANITY_DATASET ||
      'production',
  },
  studioHost: 'localhost',
});
