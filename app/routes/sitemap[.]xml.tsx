/**
 * Dynamic Sitemap.xml Route for Sierra Nevada Friends of the Family
 *
 * Generates XML sitemap based on Sanity global SEO settings and discoverable content.
 * Respects members-only site controls and individual page indexability settings.
 *
 * Adapted from Rubato Wines implementation with Sanity CMS integration.
 */

import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';
import {
  SETTINGS_QUERY,
  isSiteDiscoverable,
} from '~/lib/sanity/queries/settings';
import {shouldNoIndex} from '~/lib/seo/routes';
import type {Settings} from '~/studio/sanity.types';

export async function loader({context}: LoaderFunctionArgs) {
  try {
    // Create Sanity client to fetch global SEO settings and content
    const sanityClient = createSanityClient(context.env);
    const {storefront} = context;

    // Load global settings to determine if sitemap should be generated
    const settings = await sanityServerQuery<Settings | null>(
      sanityClient,
      SETTINGS_QUERY,
      {},
      {
        displayName: 'Settings for Sitemap',
        env: context.env,
      },
    ).catch((error) => {
      console.error(
        'Failed to load settings for sitemap:',
        error instanceof Error ? error.message : String(error),
      );
      return null;
    });

    // If site is not discoverable, return empty sitemap
    if (!isSiteDiscoverable(settings)) {
      return new Response(generateEmptySitemap(), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
          'X-Robots-Tag': 'noindex',
        },
      });
    }

    // Get base URL for sitemap entries
    const baseUrl = getBaseUrl(context);

    // Generate sitemap entries
    const sitemapEntries: SitemapEntry[] = [];

    // Add homepage if indexable
    if (!shouldNoIndex('/', settings)) {
      sitemapEntries.push({
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 1.0,
      });
    }

    // Add static pages that are indexable
    const staticPages = [
      {path: '/collections', priority: 0.8},
      {path: '/products', priority: 0.8},
      {path: '/about', priority: 0.6},
      {path: '/contact', priority: 0.6},
    ];

    for (const page of staticPages) {
      if (!shouldNoIndex(page.path, settings)) {
        sitemapEntries.push({
          loc: `${baseUrl}${page.path}`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: page.priority,
        });
      }
    }

    // Fetch and add discoverable products and collections in parallel
    const [productsData, collectionsData] = await Promise.all([
      fetchDiscoverableProducts(storefront, settings),
      fetchDiscoverableCollections(storefront, settings),
    ]);

    // Add product entries
    productsData.forEach((product) => {
      if (!shouldNoIndex(`/products/${product.handle}`, settings)) {
        sitemapEntries.push({
          loc: `${baseUrl}/products/${product.handle}`,
          lastmod: product.updatedAt,
          changefreq: 'weekly',
          priority: 0.7,
        });
      }
    });

    // Add collection entries
    collectionsData.forEach((collection) => {
      if (!shouldNoIndex(`/collections/${collection.handle}`, settings)) {
        sitemapEntries.push({
          loc: `${baseUrl}/collections/${collection.handle}`,
          lastmod: collection.updatedAt,
          changefreq: 'weekly',
          priority: 0.6,
        });
      }
    });

    // Generate XML sitemap
    const sitemapXml = generateSitemapXml(sitemapEntries);

    return new Response(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex', // Don't index the sitemap file itself
      },
    });
  } catch (error) {
    console.error(
      'Critical error in sitemap generation:',
      error instanceof Error ? error.message : String(error),
    );

    // Return empty sitemap on error to prevent breaking search engine crawling
    return new Response(generateEmptySitemap(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // Shorter cache for error state
        'X-Robots-Tag': 'noindex',
      },
    });
  }
}

// Types for sitemap entries
interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

interface ProductSitemapData {
  handle: string;
  updatedAt: string;
}

interface CollectionSitemapData {
  handle: string;
  updatedAt: string;
}

/**
 * Get base URL for sitemap entries
 */
function getBaseUrl(context: LoaderFunctionArgs['context']): string {
  // Try to get from shop data or environment
  return 'https://friends.sierranevada.com'; // Fallback for now
}

/**
 * Generate empty sitemap for non-discoverable sites or errors
 */
function generateEmptySitemap(): string {
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">
  <!-- Site not discoverable or error occurred -->
</urlset>`;
}

/**
 * Generate XML sitemap from entries
 */
function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlElements = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\\n');

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">
${urlElements}
</urlset>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Fetch discoverable products for sitemap
 */
async function fetchDiscoverableProducts(
  storefront: any,
  settings: Settings | null,
): Promise<ProductSitemapData[]> {
  try {
    // Only fetch if site is discoverable
    if (!isSiteDiscoverable(settings)) {
      return [];
    }

    const response = await storefront.query(PRODUCTS_SITEMAP_QUERY, {
      variables: {first: 250}, // Reasonable limit for sitemap
    });

    return (
      response.products?.nodes?.map((product: any) => ({
        handle: product.handle,
        updatedAt: product.updatedAt,
      })) || []
    );
  } catch (error) {
    console.error(
      'Failed to fetch products for sitemap:',
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}

/**
 * Fetch discoverable collections for sitemap
 */
async function fetchDiscoverableCollections(
  storefront: any,
  settings: Settings | null,
): Promise<CollectionSitemapData[]> {
  try {
    // Only fetch if site is discoverable
    if (!isSiteDiscoverable(settings)) {
      return [];
    }

    const response = await storefront.query(COLLECTIONS_SITEMAP_QUERY, {
      variables: {first: 50}, // Reasonable limit for collections
    });

    return (
      response.collections?.nodes?.map((collection: any) => ({
        handle: collection.handle,
        updatedAt: collection.updatedAt,
      })) || []
    );
  } catch (error) {
    console.error(
      'Failed to fetch collections for sitemap:',
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}

// GraphQL queries for sitemap data
const PRODUCTS_SITEMAP_QUERY = `#graphql
  query ProductsSitemap($first: Int!) {
    products(first: $first, query: \"status:active\") {
      nodes {
        handle
        updatedAt
      }
    }
  }
` as const;

const COLLECTIONS_SITEMAP_QUERY = `#graphql
  query CollectionsSitemap($first: Int!) {
    collections(first: $first) {
      nodes {
        handle
        updatedAt
      }
    }
  }
` as const;

// This route only handles GET requests for sitemap.xml
// No component export needed as this is a resource route
