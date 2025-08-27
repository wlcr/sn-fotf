/**
 * Sanity CMS Integration for React Router v7 + Hydrogen
 *
 * This provides Sanity CMS integration optimized for the Friends of the Family
 * project, using React Router v7 data loading patterns and Sanity's type generation.
 *
 * Key Features:
 * - React Router v7 compatible data loading
 * - Hydrogen caching integration
 * - Type-safe queries using generated Sanity types
 * - Client and server-side query patterns
 */

import {createClient} from '@sanity/client';
import type {SanityClient, ClientConfig} from '@sanity/client';
import {createQueryStore} from '@sanity/react-loader';
import imageUrlBuilder from '@sanity/image-url';
import type {ImageUrlBuilder} from '@sanity/image-url/lib/types/builder';
import type {SanityImageSource} from '@sanity/image-url/lib/types/types';

// Re-export modern live query utilities for React Router v7 + Hydrogen integration
// @sanity/react-loader provides better SSR support and performance than preview-kit
export {createQueryStore} from '@sanity/react-loader';

// Environment variables interface for server-side Sanity operations
// Follows Hydrogen 2025.5.0 patterns: PUBLIC_ prefix for client-accessible vars
// Separates public (client-safe) from private (server-only) environment variables
interface SanityEnv {
  // Public variables - safe to expose to client-side
  PUBLIC_SANITY_PROJECT_ID: string;
  PUBLIC_SANITY_DATASET?: string;

  // Private variables - server-only, never expose to client
  SANITY_API_VERSION?: string;
  SANITY_API_TOKEN?: string; // Server-only secret
  SANITY_USE_CDN?: string; // Server-only configuration
  SANITY_PREVIEW_SECRET?: string; // Server-only secret
  SANITY_REVALIDATE_SECRET?: string; // Server-only secret
  NODE_ENV?: string;
}

// Client-safe environment variables interface
interface SanityClientEnv {
  PUBLIC_SANITY_PROJECT_ID: string;
  PUBLIC_SANITY_DATASET?: string;
}

// Type guard to check if environment has required Sanity configuration
function isValidSanityEnv(env: Partial<SanityEnv>): env is SanityEnv {
  return !!env.PUBLIC_SANITY_PROJECT_ID;
}

/**
 * Convert and validate Env to SanityEnv
 *
 * @param env - Environment variables from context
 * @returns Validated SanityEnv
 * @throws Error if required variables are missing
 */
export function validateSanityEnv(env: Partial<SanityEnv>): SanityEnv {
  if (!env.PUBLIC_SANITY_PROJECT_ID) {
    throw new Error(
      'PUBLIC_SANITY_PROJECT_ID is required for Sanity integration. Please check your environment variables.',
    );
  }

  return {
    PUBLIC_SANITY_PROJECT_ID: env.PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET: env.PUBLIC_SANITY_DATASET,
    SANITY_API_VERSION: env.SANITY_API_VERSION,
    SANITY_API_TOKEN: env.SANITY_API_TOKEN,
    SANITY_USE_CDN: env.SANITY_USE_CDN,
    SANITY_PREVIEW_SECRET: env.SANITY_PREVIEW_SECRET,
    SANITY_REVALIDATE_SECRET: env.SANITY_REVALIDATE_SECRET,
    NODE_ENV: env.NODE_ENV,
  };
}

// Sanity image object interface for type safety
interface SanityImageAsset {
  _ref: string;
  _type: 'reference';
}

interface SanityImage {
  asset?: SanityImageAsset;
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Content object interface for member access control
interface ContentWithAccess {
  membersOnly?: boolean;
  [key: string]: unknown;
}

// Announcement interface for filtering
interface Announcement {
  membersOnly?: boolean;
  expiresAt?: string | null;
  publishedAt?: string | null;
  [key: string]: unknown;
}

// Hydrogen cache strategy interface (placeholder for better type safety)
interface HydrogenCacheStrategy {
  [key: string]: unknown;
}

/**
 * Check if sessionStorage is available and accessible
 *
 * @returns Whether sessionStorage is available
 */
function isSessionStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return false;
    }
    // Test if we can actually use sessionStorage
    const testKey = '__sanity_storage_test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear old Sanity cache entries from sessionStorage to make room for new ones
 * Only removes entries that are older than 1 hour
 */
function clearOldSanityCacheEntries(): void {
  try {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const keysToRemove: string[] = [];

    // Find old sanity cache entries
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('sanity_cache:')) {
        try {
          const value = sessionStorage.getItem(key);
          if (value) {
            const parsed: unknown = JSON.parse(value);
            if (
              parsed &&
              typeof parsed === 'object' &&
              'timestamp' in parsed &&
              typeof parsed.timestamp === 'number' &&
              parsed.timestamp < oneHourAgo
            ) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // Invalid entry, mark for removal
          keysToRemove.push(key);
        }
      }
    }

    // Remove old entries
    keysToRemove.forEach((key) => {
      try {
        sessionStorage.removeItem(key);
      } catch {
        // Ignore removal errors
      }
    });
  } catch (error) {
    console.warn('Failed to clear old cache entries:', error);
  }
}

/**
 * Create a Sanity client instance
 *
 * @param env - Environment variables from Hydrogen context
 * @param options - Additional client configuration options
 * @returns Configured Sanity client
 */
export function createSanityClient(
  env: SanityEnv,
  options: Partial<ClientConfig> = {},
): SanityClient {
  return createClient({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: env.SANITY_API_VERSION || '2025-01-01',
    useCdn: env.SANITY_USE_CDN === 'true' || env.NODE_ENV === 'production',
    token: env.SANITY_API_TOKEN,
    ...options,
  });
}

/**
 * Create a Sanity client for live preview mode
 * Always uses a read token and disables CDN for real-time updates
 *
 * @param env - Environment variables from Hydrogen context
 * @param options - Additional client configuration options
 * @returns Configured Sanity client for preview
 */
export function createSanityPreviewClient(
  env: SanityEnv,
  options: Partial<ClientConfig> = {},
): SanityClient {
  if (!env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN is required for preview mode');
  }

  return createClient({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: env.SANITY_API_VERSION || '2025-01-01',
    useCdn: false, // Always disable CDN for preview
    token: env.SANITY_API_TOKEN,
    perspective: 'previewDrafts', // Include draft content
    ...options,
  });
}

/**
 * Server-side Sanity query with Hydrogen caching
 *
 * Use this in React Router v7 `loader` functions for server-side data fetching
 * with Hydrogen's built-in caching strategies.
 *
 * @param client - Sanity client instance
 * @param query - GROQ query string
 * @param params - Query parameters
 * @param options - Caching and debugging options
 * @returns Promise resolving to query result
 */
export async function sanityServerQuery<T = unknown>(
  client: SanityClient,
  query: string,
  params: Record<string, unknown> = {},
  options: {
    cache?: HydrogenCacheStrategy; // Hydrogen cache strategy (CacheLong, CacheShort, etc.)
    tags?: string[];
    displayName?: string; // For debugging in Hydrogen's subrequest profiler
    env?: SanityEnv; // Environment variables for safe cross-environment access
  } = {},
): Promise<T> {
  const {cache, tags, displayName, env} = options;

  try {
    // For server-side caching, we'll rely on Sanity's built-in CDN caching
    // and the client configuration (useCdn: true in production)
    // Custom caching can be added here if needed in the future

    const result = await client.fetch<T>(query, params);

    // Log for debugging if displayName is provided and in development
    if (displayName && env?.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`[Sanity Query] ${displayName}: ${query}`);
    }

    return result;
  } catch (error) {
    console.error('Sanity server query failed:', {query, params, error});
    throw new SanityError(
      error instanceof Error ? error.message : 'Query failed',
      500,
      query,
    );
  }
}

/**
 * Client-side Sanity query with browser caching
 *
 * Use this in React Router v7 `clientLoader` functions for browser-side
 * data fetching with sessionStorage caching.
 *
 * @param client - Sanity client instance
 * @param query - GROQ query string
 * @param params - Query parameters
 * @param options - Client-side caching options
 * @returns Promise resolving to query result
 */
export async function sanityClientQuery<T = unknown>(
  client: SanityClient,
  query: string,
  params: Record<string, unknown> = {},
  options: {
    useCache?: boolean;
    cacheKey?: string;
    cacheDuration?: number; // in milliseconds, default 5 minutes
  } = {},
): Promise<T> {
  const {
    useCache = true,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
  } = options;

  try {
    // Client-side caching using sessionStorage
    if (
      useCache &&
      typeof window !== 'undefined' &&
      isSessionStorageAvailable()
    ) {
      const key =
        cacheKey || `sanity_cache:${btoa(query + JSON.stringify(params))}`;

      // Check cache first
      try {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);
            // Type guard for cached data structure
            if (
              parsedCache &&
              typeof parsedCache === 'object' &&
              'data' in parsedCache &&
              'timestamp' in parsedCache &&
              typeof (parsedCache as {timestamp: unknown}).timestamp ===
                'number'
            ) {
              const cacheEntry = parsedCache as {data: T; timestamp: number};
              const isExpired =
                Date.now() - cacheEntry.timestamp > cacheDuration;

              if (!isExpired) {
                return cacheEntry.data;
              }
            } else {
              // Invalid cache structure, remove it
              try {
                sessionStorage.removeItem(key);
              } catch (removeError) {
                // Silently ignore removal errors
              }
            }
          } catch (parseError) {
            // Invalid JSON in cache, log warning and clear it
            console.warn('Invalid JSON in cache entry, removing:', {
              key,
              error:
                parseError instanceof Error
                  ? parseError.message
                  : 'Unknown parse error',
            });
            try {
              sessionStorage.removeItem(key);
            } catch (removeError) {
              // Silently ignore removal errors
            }
          }
        }
      } catch (cacheError) {
        // Cache read failed, continue with fresh fetch
        console.warn('SessionStorage read failed:', cacheError);
      }

      // Fetch fresh data
      const result = await client.fetch<T>(query, params);

      // Cache the result
      try {
        const cacheData = JSON.stringify({
          data: result,
          timestamp: Date.now(),
        });
        sessionStorage.setItem(key, cacheData);
      } catch (cacheError) {
        // Cache write failed (quota exceeded or other error), but we have the data
        if (cacheError instanceof DOMException && cacheError.code === 22) {
          console.warn('SessionStorage quota exceeded, clearing old entries');
          try {
            // Clear old sanity cache entries
            clearOldSanityCacheEntries();
            // Retry once
            sessionStorage.setItem(
              key,
              JSON.stringify({data: result, timestamp: Date.now()}),
            );
          } catch (retryError) {
            console.warn(
              'SessionStorage write failed after cleanup:',
              retryError,
            );
          }
        } else {
          console.warn('SessionStorage write failed:', cacheError);
        }
      }

      return result;
    }

    // Direct fetch without caching
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error('Sanity client query failed:', {query, params, error});
    throw error;
  }
}

/**
 * Sanity Configuration
 *
 * Server-safe configuration that doesn't import studio config to avoid
 * browser-specific modules being loaded in the server environment.
 */

// Server-safe config using constants
// Note: Project IDs are not sensitive information - they're visible in API URLs and client requests
// Sensitive information (API tokens, secrets) are handled separately via environment variables
export const sanityConfig = {
  projectId: 'rimuhevv', // Not sensitive - visible in API URLs
  dataset: 'production',
  apiVersion: '2025-01-01',
  studioUrl: 'http://localhost:3333',
};

/**
 * Simple wrapper function for compatibility with PR components
 * Uses our robust getSanityImageUrlWithEnv under the hood
 */
export function urlForImage(source: any) {
  if (!source?.asset?._ref) {
    return undefined;
  }

  // Return a builder-like object that matches the PR's usage pattern
  return {
    width: (w: number) => ({
      height: (h: number) => ({
        auto: (format: string) => ({
          url: () =>
            getSanityImageUrlWithEnv(source, {
              width: w,
              height: h,
              format: 'auto',
            }),
        }),
      }),
      auto: (format: string) => ({
        url: () => getSanityImageUrlWithEnv(source, {width: w, format: 'auto'}),
      }),
    }),
    height: (h: number) => ({
      auto: (format: string) => ({
        url: () =>
          getSanityImageUrlWithEnv(source, {height: h, format: 'auto'}),
      }),
    }),
    auto: (format: string) => ({
      url: () => getSanityImageUrlWithEnv(source, {format: 'auto'}),
    }),
    url: () => getSanityImageUrlWithEnv(source),
  };
}

/**
 * Create an image URL builder instance for Sanity images
 * Uses the official @sanity/image-url package for better reliability and features
 *
 * @param config - Sanity project configuration
 * @returns ImageUrlBuilder instance
 */
export function createImageUrlBuilder(config: {
  projectId: string;
  dataset: string;
}): ImageUrlBuilder {
  return imageUrlBuilder(config);
}

/**
 * Utility for generating optimized Sanity image URLs using official @sanity/image-url
 *
 * @param image - Sanity image source (can be image object, asset reference, or asset ID)
 * @param options - Image optimization options
 * @param config - Sanity project configuration (required)
 * @returns Optimized image URL string
 *
 * @example
 * // Recommended usage with explicit config
 * const imageUrl = getSanityImageUrl(
 *   image,
 *   { width: 800, quality: 80, format: 'webp' },
 *   { projectId: 'your-project-id', dataset: 'production' }
 * );
 */
export function getSanityImageUrl(
  image: SanityImageSource,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
    blur?: number;
    sharpen?: number;
  } = {},
  config: {
    projectId: string;
    dataset: string;
  },
): string {
  if (!image || !config.projectId) {
    console.warn(
      'Invalid image source or missing Sanity project configuration',
    );
    return '';
  }

  try {
    const builder = createImageUrlBuilder(config);
    let urlBuilder = builder.image(image);

    // Apply image transformations using the builder pattern
    if (options.width) urlBuilder = urlBuilder.width(options.width);
    if (options.height) urlBuilder = urlBuilder.height(options.height);
    if (options.quality) urlBuilder = urlBuilder.quality(options.quality);
    if (options.format) urlBuilder = urlBuilder.format(options.format);
    if (options.fit) urlBuilder = urlBuilder.fit(options.fit);
    if (options.crop) {
      if (options.crop === 'focalpoint') {
        urlBuilder = urlBuilder.crop('focalpoint');
      } else {
        urlBuilder = urlBuilder.crop(options.crop);
      }
    }
    if (options.blur) urlBuilder = urlBuilder.blur(options.blur);
    if (options.sharpen) urlBuilder = urlBuilder.sharpen(options.sharpen);

    return urlBuilder.url() || '';
  } catch (error) {
    console.error('Failed to generate Sanity image URL:', error);
    return '';
  }
}

/**
 * Helper function to get Sanity image URL with safe environment variable fallback
 *
 * @param image - Sanity image source
 * @param options - Image optimization options
 * @param env - Environment variables (optional)
 * @returns Optimized image URL string or empty string if config is missing
 */
export function getSanityImageUrlWithEnv(
  image: SanityImageSource,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
    blur?: number;
    sharpen?: number;
  } = {},
  env?: Partial<SanityEnv>,
): string {
  // Safe cross-environment project config detection with hardcoded fallbacks
  // Use the same values as our sanityConfig constant
  const projectId =
    env?.PUBLIC_SANITY_PROJECT_ID ||
    (() => {
      const envVars =
        typeof window === 'undefined'
          ? typeof process !== 'undefined' && process.env
            ? process.env
            : {}
          : window.ENV || {};
      return (envVars as Record<string, string | undefined>)
        .PUBLIC_SANITY_PROJECT_ID;
    })() ||
    sanityConfig.projectId; // Use hardcoded fallback

  const dataset =
    env?.PUBLIC_SANITY_DATASET ||
    (() => {
      const envVars =
        typeof window === 'undefined'
          ? typeof process !== 'undefined' && process.env
            ? process.env
            : {}
          : window.ENV || {};
      return (envVars as Record<string, string | undefined>)
        .PUBLIC_SANITY_DATASET;
    })() ||
    sanityConfig.dataset; // Use hardcoded fallback

  if (!projectId) {
    console.warn(
      'Sanity projectId is missing. Please set SANITY_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID in your environment.',
    );
    return '';
  }

  // Handle 'auto' format by converting it to undefined (let Sanity choose)
  const processedOptions: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
    blur?: number;
    sharpen?: number;
  } = {
    width: options.width,
    height: options.height,
    quality: options.quality,
    format: options.format === 'auto' ? undefined : options.format,
    fit: options.fit,
    crop: options.crop,
    blur: options.blur,
    sharpen: options.sharpen,
  };

  return getSanityImageUrl(image, processedOptions, {projectId, dataset});
}

/**
 * Custom error class for Sanity operations
 */
export class SanityError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public query?: string,
  ) {
    super(message);
    this.name = 'SanityError';
  }
}

/**
 * Helper function to check if content is available to current user
 *
 * @param content - Content object with potential membersOnly flag
 * @param isMember - Whether the current user is a member
 * @returns Whether the content should be displayed
 */
export function isContentAvailable(
  content: ContentWithAccess,
  isMember: boolean = false,
): boolean {
  if (!content.membersOnly) return true;
  return isMember;
}

/**
 * Helper function to filter announcements by current date and user status
 *
 * @param announcements - Array of announcement objects
 * @param isMember - Whether the current user is a member
 * @returns Filtered announcements
 */
export function filterActiveAnnouncements(
  announcements: Announcement[],
  isMember: boolean = false,
): Announcement[] {
  const now = new Date();

  return announcements.filter((announcement) => {
    // Check if announcement is for members only
    if (announcement.membersOnly && !isMember) return false;

    // Check if announcement has expired
    if (announcement.expiresAt && new Date(announcement.expiresAt) < now)
      return false;

    // Check if announcement is published
    if (announcement.publishedAt && new Date(announcement.publishedAt) > now)
      return false;

    return true;
  });
}

/**
 * Check if preview mode is enabled based on request parameters or cookies
 *
 * @param request - Request object with URL and headers
 * @param env - Environment variables
 * @returns Whether preview mode is active
 */
export function isPreviewMode(request: Request, env: SanityEnv): boolean {
  const url = new URL(request.url);

  // Check for preview query parameter with secret
  const previewParam = url.searchParams.get('preview');
  if (previewParam === env.SANITY_PREVIEW_SECRET) {
    return true;
  }

  // Check for preview cookie (set by preview API route)
  const cookies = request.headers.get('Cookie') || '';
  const previewCookie = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith('sanity-preview='))
    ?.split('=')?.[1];

  return previewCookie === 'true';
}

/**
 * Smart query function that automatically chooses between regular and preview client
 * based on preview mode detection
 *
 * @param request - Request object
 * @param env - Environment variables
 * @param query - GROQ query string
 * @param params - Query parameters
 * @param options - Query options
 * @returns Promise resolving to query result
 */
export async function sanityQuery<T = unknown>(
  request: Request,
  env: SanityEnv,
  query: string,
  params: Record<string, unknown> = {},
  options: {
    cache?: HydrogenCacheStrategy;
    tags?: string[];
    displayName?: string;
  } = {},
): Promise<T> {
  const inPreviewMode = isPreviewMode(request, env);

  if (inPreviewMode) {
    // Use preview client and disable caching
    const previewClient = createSanityPreviewClient(env);
    // eslint-disable-next-line no-console
    console.log(`[Sanity Preview] Fetching: ${options.displayName || 'query'}`);
    return await previewClient.fetch<T>(query, params);
  } else {
    // Use regular client with caching
    const client = createSanityClient(env);
    return await sanityServerQuery<T>(client, query, params, {...options, env});
  }
}

/**
 * Live query hook data for React components
 * Returns both initial data and live query setup
 *
 * @param query - GROQ query string
 * @param params - Query parameters
 * @param initial - Initial data from server
 * @param enabled - Whether live updates are enabled
 * @returns Live query data structure
 */
export function createLiveQueryData<T = unknown>(
  query: string,
  params: Record<string, unknown>,
  initial: T,
  enabled: boolean = false,
) {
  return {
    query,
    params,
    initial,
    enabled,
    // These will be used by the client-side live query hook
    key: `${query}-${JSON.stringify(params)}`,
    timestamp: Date.now(),
  };
}

/**
 * Generate preview URLs for Sanity Studio
 *
 * @param slug - Document slug
 * @param type - Document type
 * @param env - Environment variables (optional, will use safe detection if not provided)
 * @param secret - Preview secret override
 * @returns Preview URL object
 */
export function generatePreviewUrl(
  slug: string,
  type: string,
  env?: SanityEnv,
  secret?: string,
): {preview: string; exit: string} {
  // Safe cross-environment base URL detection
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : (() => {
          // Safe server-side environment variable access
          const serverEnv =
            typeof process !== 'undefined' && process.env ? process.env : {};
          return (
            (serverEnv as Record<string, string | undefined>).PUBLIC_BASE_URL ||
            'http://localhost:3000'
          );
        })();

  // Use provided secret or get from environment with safe access
  const previewSecret =
    secret ||
    env?.SANITY_PREVIEW_SECRET ||
    (() => {
      const envVars =
        typeof window === 'undefined'
          ? typeof process !== 'undefined' && process.env
            ? process.env
            : {}
          : window.ENV || {};
      return (envVars as Record<string, string | undefined>)
        .SANITY_PREVIEW_SECRET;
    })();

  const previewUrl = new URL(`/${type}/${slug}`, baseUrl);
  if (previewSecret) {
    previewUrl.searchParams.set('preview', previewSecret);
  }

  const exitUrl = new URL('/api/preview/exit', baseUrl);

  return {
    preview: previewUrl.toString(),
    exit: exitUrl.toString(),
  };
}
