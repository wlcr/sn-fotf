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
 * Get Sanity configuration from environment with fallbacks
 *
 * @param env - Environment variables object (optional)
 * @returns Sanity configuration object
 */
export function getSanityConfig(env?: Record<string, string | undefined>) {
  // Use our centralized sanity config as fallback, but allow env override
  const projectId =
    env?.PUBLIC_SANITY_PROJECT_ID ||
    (typeof window === 'undefined'
      ? env?.SANITY_PROJECT_ID
      : window.ENV?.PUBLIC_SANITY_PROJECT_ID) ||
    SANITY_CONFIG.projectId ||
    '';

  const dataset =
    env?.PUBLIC_SANITY_DATASET ||
    (typeof window === 'undefined'
      ? env?.SANITY_DATASET
      : window.ENV?.PUBLIC_SANITY_DATASET) ||
    SANITY_CONFIG.dataset ||
    'production';

  const apiVersion =
    env?.SANITY_API_VERSION || SANITY_CONFIG.apiVersion || '2025-01-01';

  const studioUrl =
    env?.SANITY_STUDIO_URL ||
    SANITY_CONFIG.studioUrl ||
    'http://localhost:3333';

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
      'Missing Sanity project ID. Please set PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID in your environment variables.',
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
