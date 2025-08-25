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

import { createClient } from '@sanity/client';
import type { SanityClient, ClientConfig } from '@sanity/client';
import { defineLive } from '@sanity/preview-kit';
import type { LiveQueryStore } from '@sanity/preview-kit';

// Re-export live preview utilities to enable consumers of this module to implement
// real-time Sanity content previews in Hydrogen/React Router v7 apps. This exposes
// the necessary helpers for integrating live query and preview functionality.
export { defineLive } from '@sanity/preview-kit';
export type { LiveQueryStore } from '@sanity/preview-kit';

// Environment variables interface
interface SanityEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  SANITY_API_TOKEN?: string;
  SANITY_USE_CDN?: string;
  SANITY_PREVIEW_SECRET?: string;
  SANITY_REVALIDATE_SECRET?: string;
  NODE_ENV?: string;
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
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const keysToRemove: string[] = [];
    
    // Find old sanity cache entries
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('sanity_cache:')) {
        try {
          const value = sessionStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            if (parsed.timestamp && parsed.timestamp < oneHourAgo) {
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
    keysToRemove.forEach(key => {
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
  options: Partial<ClientConfig> = {}
): SanityClient {
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET || 'production',
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
  options: Partial<ClientConfig> = {}
): SanityClient {
  if (!env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN is required for preview mode');
  }

  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET || 'production',
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
export async function sanityServerQuery<T = any>(
  client: SanityClient,
  query: string,
  params: Record<string, any> = {},
  options: {
    cache?: HydrogenCacheStrategy; // Hydrogen cache strategy (CacheLong, CacheShort, etc.)
    tags?: string[];
    displayName?: string; // For debugging in Hydrogen's subrequest profiler
    env?: SanityEnv; // Environment variables for safe cross-environment access
  } = {}
): Promise<T> {
  const { cache, tags, displayName, env } = options;
  
  try {
    // For server-side caching, we'll rely on Sanity's built-in CDN caching
    // and the client configuration (useCdn: true in production)
    // Custom caching can be added here if needed in the future
    
    const result = await client.fetch<T>(query, params);
    
    // Log for debugging if displayName is provided and in development
    if (displayName && env?.NODE_ENV === 'development') {
      console.log(`[Sanity Query] ${displayName}: ${query}`);
    }
    
    return result;
  } catch (error) {
    console.error('Sanity server query failed:', { query, params, error });
    throw new SanityError(
      error instanceof Error ? error.message : 'Query failed',
      500,
      query
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
export async function sanityClientQuery<T = any>(
  client: SanityClient,
  query: string,
  params: Record<string, any> = {},
  options: {
    useCache?: boolean;
    cacheKey?: string;
    cacheDuration?: number; // in milliseconds, default 5 minutes
  } = {}
): Promise<T> {
  const { 
    useCache = true, 
    cacheKey, 
    cacheDuration = 5 * 60 * 1000 // 5 minutes default
  } = options;
  
  try {
    // Client-side caching using sessionStorage
    if (useCache && typeof window !== 'undefined' && isSessionStorageAvailable()) {
      const key = cacheKey || `sanity_cache:${btoa(query + JSON.stringify(params))}`;
      
      // Check cache first
      try {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);
            if (parsedCache && typeof parsedCache === 'object' && 'data' in parsedCache && 'timestamp' in parsedCache) {
              const { data, timestamp } = parsedCache;
              const isExpired = Date.now() - timestamp > cacheDuration;
              
              if (!isExpired) {
                return data;
              }
            }
          } catch (parseError) {
            // Invalid JSON in cache, clear it
            try {
              sessionStorage.removeItem(key);
            } catch (removeError) {
              // Ignore removal errors
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
          timestamp: Date.now()
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
            sessionStorage.setItem(key, JSON.stringify({ data: result, timestamp: Date.now() }));
          } catch (retryError) {
            console.warn('SessionStorage write failed after cleanup:', retryError);
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
    console.error('Sanity client query failed:', { query, params, error });
    throw error;
  }
}

/**
 * GROQ query fragments for Friends of the Family project content types
 * 
 * These queries are designed to work with generated Sanity types.
 * Run `npm run sanity:codegen` to generate TypeScript types from your schema.
 */
export const SANITY_QUERIES = {
  // Site-wide settings and configuration
  SITE_SETTINGS: `*[_type == "siteSettings"][0]{
    _id,
    title,
    description,
    logo,
    favicon,
    socialMedia,
    membershipInfo {
      title,
      description,
      benefits[]
    },
    _updatedAt
  }`,
  
  // Main navigation structure
  NAVIGATION: `*[_type == "navigation"][0]{
    _id,
    mainNavigation[] {
      title,
      url,
      _type == "reference" => @->{
        title,
        "url": "/pages/" + slug.current
      }
    },
    memberNavigation[] {
      title,
      url,
      _type == "reference" => @->{
        title,
        "url": "/pages/" + slug.current
      }
    },
    footerNavigation[] {
      title,
      url,
      _type == "reference" => @->{
        title,
        "url": "/pages/" + slug.current
      }
    }
  }`,
  
  // Individual page content by slug
  PAGE_BY_SLUG: `*[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    content,
    hero {
      title,
      subtitle,
      image,
      ctaText,
      ctaUrl
    },
    seo {
      title,
      description,
      ogImage
    },
    membersOnly,
    _updatedAt
  }`,
  
  // All pages for sitemap generation
  ALL_PAGES: `*[_type == "page"] {
    _id,
    title,
    slug,
    _updatedAt,
    membersOnly
  }`,
  
  // Member-specific content and benefits
  MEMBER_CONTENT: `*[_type == "memberContent"][0]{
    _id,
    welcome {
      title,
      message,
      image
    },
    benefits[] {
      title,
      description,
      icon,
      features[]
    },
    exclusiveContent[] {
      title,
      description,
      content,
      availableFrom,
      availableUntil
    },
    _updatedAt
  }`,
  
  // Events and activities for members
  UPCOMING_EVENTS: `*[_type == "event" && date > now()] | order(date asc) {
    _id,
    title,
    description,
    date,
    location,
    image,
    membersOnly,
    registrationRequired,
    maxCapacity,
    _updatedAt
  }`,
  
  // Announcements and updates
  ANNOUNCEMENTS: `*[_type == "announcement"] | order(_createdAt desc) [0...5] {
    _id,
    title,
    content,
    priority,
    membersOnly,
    publishedAt,
    expiresAt,
    _createdAt
  }`,
  
  // Product spotlights and features
  PRODUCT_SPOTLIGHTS: `*[_type == "productSpotlight"] | order(_createdAt desc) {
    _id,
    title,
    description,
    shopifyProduct {
      handle,
      title,
      featuredImage
    },
    memberDiscount,
    availableFrom,
    availableUntil,
    _createdAt
  }`,
} as const;

/**
 * Utility for generating optimized Sanity image URLs
 * 
 * @param image - Sanity image object
 * @param options - Image optimization options  
 * @param config - Sanity project configuration (recommended for consistent behavior)
 * @returns Optimized image URL string
 * 
 * @example
 * // Recommended: Pass config explicitly
 * const imageUrl = getSanityImageUrl(
 *   image, 
 *   { width: 800, quality: 80 }, 
 *   { projectId: 'your-project-id', dataset: 'production' }
 * );
 * 
 * // Fallback: Uses environment variables (less reliable across environments)
 * const imageUrl = getSanityImageUrl(image, { width: 800 });
 */
export function getSanityImageUrl(
  image: SanityImage,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
  } = {},
  config?: {
    projectId?: string;
    dataset?: string;
  }
): string {
  if (!image?.asset?._ref) {
    console.warn('Invalid Sanity image object provided');
    return '';
  }
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'fill',
    crop = 'center'
  } = options;
  
  // Extract image details from Sanity reference
  const refParts = image.asset._ref.split('-');
  if (refParts.length < 4) {
    console.error('Invalid Sanity image reference format:', image.asset._ref);
    return '';
  }
  
  const [, assetId, dimensions, format_] = refParts;
  const [w, h] = dimensions.split('x');
  
  // Build Sanity CDN URL - prefer explicit config over environment variables
  // This approach works consistently across server and client environments
  let projectId = config?.projectId;
  let dataset = config?.dataset;
  
  // Fallback to environment variables if config not provided
  // Use safe cross-environment access pattern to avoid runtime errors
  if (!projectId) {
    const env = typeof window === 'undefined' 
      ? (typeof process !== 'undefined' ? process.env : {}) 
      : (window.ENV || {});
    projectId = env.PUBLIC_SANITY_PROJECT_ID;
  }
  
  if (!dataset) {
    const env = typeof window === 'undefined' 
      ? (typeof process !== 'undefined' ? process.env : {}) 
      : (window.ENV || {});
    dataset = env.PUBLIC_SANITY_DATASET;
    // Fallback to production if still not found
    dataset = dataset || 'production';
  }
  
  if (!projectId) {
    console.error('Sanity projectId is missing. Please set PUBLIC_SANITY_PROJECT_ID in your environment or pass it via config parameter.');
    return '';
  }
  
  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format_}`;
  
  // Add query parameters for optimization
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality !== 80) params.set('q', quality.toString());
  if (format !== 'auto') params.set('fm', format);
  if (fit !== 'fill') params.set('fit', fit);
  if (crop !== 'center') params.set('crop', crop);
  
  // Handle focal point if available
  if (image.hotspot && crop === 'focalpoint') {
    params.set('fp-x', image.hotspot.x.toString());
    params.set('fp-y', image.hotspot.y.toString());
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  return url;
}

/**
 * Custom error class for Sanity operations
 */
export class SanityError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public query?: string
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
  isMember: boolean = false
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
  isMember: boolean = false
): Announcement[] {
  const now = new Date();
  
  return announcements.filter(announcement => {
    // Check if announcement is for members only
    if (announcement.membersOnly && !isMember) return false;
    
    // Check if announcement has expired
    if (announcement.expiresAt && new Date(announcement.expiresAt) < now) return false;
    
    // Check if announcement is published
    if (announcement.publishedAt && new Date(announcement.publishedAt) > now) return false;
    
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
    .find(cookie => cookie.trim().startsWith('sanity-preview='))
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
export async function sanityQuery<T = any>(
  request: Request,
  env: SanityEnv,
  query: string,
  params: Record<string, any> = {},
  options: {
    cache?: HydrogenCacheStrategy;
    tags?: string[];
    displayName?: string;
  } = {}
): Promise<T> {
  const inPreviewMode = isPreviewMode(request, env);
  
  if (inPreviewMode) {
    // Use preview client and disable caching
    const previewClient = createSanityPreviewClient(env);
    console.log(`[Sanity Preview] Fetching: ${options.displayName || 'query'}`);
    return await previewClient.fetch<T>(query, params);
  } else {
    // Use regular client with caching
    const client = createSanityClient(env);
    return await sanityServerQuery<T>(client, query, params, { ...options, env });
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
export function createLiveQueryData<T = any>(
  query: string,
  params: Record<string, any>,
  initial: T,
  enabled: boolean = false
) {
  return {
    query,
    params,
    initial,
    enabled,
    // These will be used by the client-side live query hook
    key: `${query}-${JSON.stringify(params)}`,
    timestamp: Date.now()
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
  secret?: string
): { preview: string; exit: string } {
  // Safe cross-environment base URL detection
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (() => {
        // Safe server-side environment variable access
        const serverEnv = typeof process !== 'undefined' ? process.env : {};
        return serverEnv.PUBLIC_BASE_URL || 'http://localhost:3000';
      })();
    
  // Use provided secret or get from environment with safe access
  const previewSecret = secret || env?.SANITY_PREVIEW_SECRET || (() => {
    const envVars = typeof window === 'undefined' 
      ? (typeof process !== 'undefined' ? process.env : {}) 
      : (window.ENV || {});
    return envVars.SANITY_PREVIEW_SECRET;
  })();
  
  const previewUrl = new URL(`/${type}/${slug}`, baseUrl);
  if (previewSecret) {
    previewUrl.searchParams.set('preview', previewSecret);
  }
  
  const exitUrl = new URL('/api/preview/exit', baseUrl);
  
  return {
    preview: previewUrl.toString(),
    exit: exitUrl.toString()
  };
}
