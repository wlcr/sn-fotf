/**
 * SEO Meta Tag Utilities
 *
 * Utilities for generating appropriate meta tags based on global settings,
 * product-specific SEO controls, and collection SEO controls.
 *
 * Designed specifically for the Friends of the Family members-only site
 * where SEO discoverability needs careful control.
 */

import type {Settings, ProductPage} from '~/studio/sanity.types';

import {
  isSiteDiscoverable,
  isRobotsCrawlingAllowed,
} from '~/lib/sanity/queries/settings';

export interface SeoMetaTags {
  title: string;
  description?: string;
  robots?: string;
  canonical?: string;
}

/**
 * Generate robots meta tag directives based on global and specific settings
 */
export function generateRobotsDirective(
  globalSettings: Settings | null,
  options?: {
    indexable?: boolean;
    followable?: boolean;
    preventIndexing?: boolean; // For collection blocks
  },
): string {
  const globalDiscoverable = isSiteDiscoverable(globalSettings);
  const globalCrawlingAllowed = isRobotsCrawlingAllowed(globalSettings);

  // If globally not discoverable, override all other settings
  if (!globalDiscoverable) {
    return 'noindex, nofollow';
  }

  // Check specific overrides
  const indexable =
    options?.preventIndexing === true ? false : (options?.indexable ?? true);
  const followable = options?.followable ?? globalCrawlingAllowed;

  const directives: string[] = [];

  if (!indexable) directives.push('noindex');
  if (!followable) directives.push('nofollow');

  // If no restrictions, return standard crawling directive
  if (directives.length === 0) {
    return 'index, follow';
  }

  return directives.join(', ');
}

/**
 * Generate meta tags for a regular page with global settings only
 */
export function generatePageMetaTags(
  globalSettings: Settings | null,
  pageData: {
    title: string;
    description?: string;
    canonical?: string;
  },
): SeoMetaTags {
  return {
    title: pageData.title,
    description: pageData.description,
    robots: generateRobotsDirective(globalSettings),
    canonical: pageData.canonical,
  };
}

/**
 * Generate meta tags for a product page with both global and product-specific SEO controls
 */
export function generateProductMetaTags(
  globalSettings: Settings | null,
  productPageData: ProductPage | null,
  productData: {
    title: string;
    description?: string;
    handle: string;
  },
): SeoMetaTags {
  // Use custom meta description if provided, otherwise fall back to product description
  const description =
    productPageData?.seoControls?.customMetaDescription ||
    productData.description;

  // Determine indexability and followability from product-specific settings
  const indexable = productPageData?.seoControls?.indexable ?? true;
  const followable = productPageData?.seoControls?.followable ?? true;

  return {
    title: productPageData?.nameOverride || productData.title,
    description,
    robots: generateRobotsDirective(globalSettings, {
      indexable,
      followable,
    }),
    canonical: `/products/${productData.handle}`,
  };
}

/**
 * Generate meta tags for a collection page
 */
export function generateCollectionMetaTags(
  globalSettings: Settings | null,
  collectionData: {
    title: string;
    description?: string;
    handle: string;
  },
  options?: {
    preventIndexing?: boolean;
  },
): SeoMetaTags {
  return {
    title: `${collectionData.title} Collection`,
    description: collectionData.description,
    robots: generateRobotsDirective(globalSettings, {
      preventIndexing: options?.preventIndexing,
    }),
    canonical: `/collections/${collectionData.handle}`,
  };
}

/**
 * Convert SEO meta tags to Remix MetaFunction format
 */
export function seoMetaTagsToRemixMeta(metaTags: SeoMetaTags) {
  const meta: Array<
    | {title: string}
    | {name: string; content: string}
    | {rel: string; href: string}
  > = [{title: metaTags.title}];

  if (metaTags.description) {
    meta.push({name: 'description', content: metaTags.description});
  }

  if (metaTags.robots) {
    meta.push({name: 'robots', content: metaTags.robots});
  }

  if (metaTags.canonical) {
    meta.push({rel: 'canonical', href: metaTags.canonical});
  }

  return meta;
}

/**
 * Generate robots.txt content based on global settings
 */
export function generateRobotsTxt(globalSettings: Settings | null): string {
  const siteDiscoverable = isSiteDiscoverable(globalSettings);
  const crawlingAllowed = isRobotsCrawlingAllowed(globalSettings);

  if (!siteDiscoverable) {
    return `# Friends of the Family - Members Only Site
User-agent: *
Disallow: /

# Block all search engines from indexing
User-agent: *
Crawl-delay: 86400`;
  }

  if (!crawlingAllowed) {
    return `# Friends of the Family - Limited Crawling
User-agent: *
Disallow: /
Allow: /$ # Allow homepage only

# Slow down crawling for privacy
User-agent: *
Crawl-delay: 3600`;
  }

  // Standard robots.txt for discoverable sites
  return `# Friends of the Family
User-agent: *
Allow: /

# Sitemap
Sitemap: https://friends.sierranevada.com/sitemap.xml`;
}

/**
 * Utility to check if a page contains collection blocks that prevent indexing
 * This helps enforce SEO policies when collection blocks are embedded in pages
 */
export function pageHasNonIndexableCollections(pageBuilder: any[]): boolean {
  if (!pageBuilder) return false;

  for (const block of pageBuilder) {
    if (
      block._type === 'collectionBlock' &&
      block.seoControls?.preventIndexing
    ) {
      return true;
    }

    // Check nested blocks in sections
    if (block.sectionBuilder) {
      for (const nestedBlock of block.sectionBuilder) {
        if (
          nestedBlock._type === 'collectionBlock' &&
          nestedBlock.seoControls?.preventIndexing
        ) {
          return true;
        }
      }
    }
  }

  return false;
}
