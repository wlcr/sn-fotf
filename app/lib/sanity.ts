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

// Environment variables interface
interface SanityEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  SANITY_API_TOKEN?: string;
  SANITY_USE_CDN?: string;
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
    useCdn: env.SANITY_USE_CDN === 'true' || process.env.NODE_ENV === 'production',
    token: env.SANITY_API_TOKEN,
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
    cache?: any; // Hydrogen cache strategy (CacheLong, CacheShort, etc.)
    tags?: string[];
    displayName?: string; // For debugging in Hydrogen's subrequest profiler
  } = {}
): Promise<T> {
  const { cache, tags, displayName } = options;
  
  try {
    // If Hydrogen cache is provided, use it
    if (cache) {
      const cacheKey = `sanity:${btoa(query + JSON.stringify(params))}`;
      
      // Try to get from cache first
      const cachedResult = await cache.match(cacheKey);
      if (cachedResult) {
        return await cachedResult.json();
      }
      
      // Fetch fresh data from Sanity
      const result = await client.fetch<T>(query, params);
      
      // Cache the result using Hydrogen's caching
      const response = new Response(JSON.stringify(result), {
        headers: { 
          'Content-Type': 'application/json',
          ...(displayName && { 'X-Debug-Display-Name': displayName })
        }
      });
      await cache.put(cacheKey, response.clone());
      
      return result;
    }
    
    // Direct fetch without caching
    return await client.fetch<T>(query, params);
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
    if (useCache && typeof window !== 'undefined') {
      const key = cacheKey || `sanity_cache:${btoa(query + JSON.stringify(params))}`;
      
      // Check cache first
      try {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > cacheDuration;
          
          if (!isExpired) {
            return data;
          }
        }
      } catch (cacheError) {
        // Cache read failed, continue with fresh fetch
        console.warn('Cache read failed:', cacheError);
      }
      
      // Fetch fresh data
      const result = await client.fetch<T>(query, params);
      
      // Cache the result
      try {
        sessionStorage.setItem(key, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      } catch (cacheError) {
        // Cache write failed, but we have the data
        console.warn('Cache write failed:', cacheError);
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
 * @returns Optimized image URL string
 */
export function getSanityImageUrl(
  image: any,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
  } = {}
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
  
  // Build Sanity CDN URL
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
  
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
  content: { membersOnly?: boolean },
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
  announcements: any[],
  isMember: boolean = false
): any[] {
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
