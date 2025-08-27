/**
 * Centralized Sanity API Configuration for React Router v7 + Hydrogen
 *
 * This file provides centralized configuration constants and utilities
 * for Sanity CMS integration. It's designed to work with our Hydrogen
 * environment patterns and React Router v7 data loading.
 */

// Import server-safe config constants
const SANITY_CONFIG = {
  projectId: 'rimuhevv',
  dataset: 'production',
  apiVersion: '2025-01-01',
  studioUrl: 'http://localhost:3333',
};

/**
 * Get Sanity configuration (hardcoded values with optional studio URL override)
 *
 * @param env - Environment variables object (optional, only for studio URL)
 * @returns Sanity configuration object
 */
export function getSanityConfig(env?: Record<string, string | undefined>) {
  // Project ID, dataset, and API version are hardcoded (not sensitive)
  const projectId = SANITY_CONFIG.projectId;
  const dataset = SANITY_CONFIG.dataset;
  const apiVersion = SANITY_CONFIG.apiVersion;

  // Only studio URL can be overridden via environment variable
  const studioUrl = env?.SANITY_STUDIO_URL || SANITY_CONFIG.studioUrl;

  return {
    projectId,
    dataset,
    apiVersion,
    studioUrl,
  };
}

/**
 * Assert that required Sanity configuration is present
 *
 * @param env - Environment variables object (optional)
 * @returns Validated Sanity configuration
 * @throws Error if required configuration is missing
 */
export function assertSanityConfig(env?: Record<string, string | undefined>) {
  const config = getSanityConfig(env);

  if (!config.projectId) {
    throw new Error(
      'Missing Sanity project ID. This should be hardcoded in the configuration.',
    );
  }

  return config;
}

/**
 * Validate Sanity configuration without throwing
 *
 * @param env - Environment variables object (optional)
 * @returns Whether the configuration is valid
 */
export function isValidSanityConfig(
  env?: Record<string, string | undefined>,
): boolean {
  try {
    assertSanityConfig(env);
    return true;
  } catch {
    return false;
  }
}

// Export configuration constants (safe for both client and server)
export const SANITY_STUDIO_BASEPATH = '/studio';
export const SANITY_DEFAULT_API_VERSION = '2025-01-01';
export const SANITY_DEFAULT_DATASET = 'production';

/**
 * Generate Sanity Studio URL for preview/editing
 *
 * @param documentType - Type of document to edit
 * @param documentId - ID of document to edit
 * @param env - Environment variables (optional)
 * @returns Studio edit URL
 */
export function generateStudioUrl(
  documentType: string,
  documentId: string,
  env?: Record<string, string | undefined>,
): string {
  const config = getSanityConfig(env);
  const baseUrl = config.studioUrl.replace(/\/$/, ''); // Remove trailing slash
  return `${baseUrl}/structure/${documentType};${documentId}`;
}
