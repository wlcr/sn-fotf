/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

import defineConfig from 'studio/sanity.config';

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const dataset = assertValue(
  defineConfig.dataset,
  'Missing environment variable: SANITY_DATASET',
);

export const projectId = assertValue(
  defineConfig.projectId,
  'Missing environment variable: SANITY_PROJECT_ID',
);

/**
 * see https://www.sanity.io/docs/api-versioning for how versioning works
 */
export const apiVersion = defineConfig.apiVersion || '2024-10-28';

/**
 * Used to configure edit intent links, for Presentation Mode, as well as to configure where the Studio is mounted in the router.
 */
export const studioUrl = defineConfig.studioUrl || 'http://localhost:3333';
