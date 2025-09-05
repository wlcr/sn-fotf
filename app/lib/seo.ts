/**
 * SEO Meta Tag Utilities for Sierra Nevada Friends of the Family
 *
 * Enhanced SEO utilities with automatic validation, length optimization,
 * and comprehensive meta tag generation. Integrates with Sanity CMS global
 * SEO controls for the members-only brewery storefront.
 *
 * Adapted from Rubato Wines implementation with Sanity CMS integration.
 */

import type {MetaDescriptor} from 'react-router';
import type {
  Settings,
  ProductPage,
  CollectionPage,
} from '~/studio/sanity.types';
import {
  isSiteDiscoverable,
  isRobotsCrawlingAllowed,
} from '~/lib/sanity/queries/settings';
import {
  generateProductOpenGraph,
  generateCollectionOpenGraph,
  generatePageOpenGraph,
  openGraphToMetaTags,
  debugOpenGraph,
  type OpenGraphData,
} from './seo/open-graph';

/**
 * SEO validation limits based on current best practices
 */
export const SEO_LIMITS = {
  title: {min: 30, max: 60, optimal: 50},
  description: {min: 120, max: 160, optimal: 155},
  keywords: {max: 10},
} as const;

/**
 * Enhanced SEO meta tags interface
 */
export interface SeoMetaTags {
  title: string;
  description?: string;
  robots?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  openGraph?: OpenGraphData | null;
}

/**
 * Validate and optimize SEO text content with automatic truncation
 */
function validateSEOText(
  text: string | undefined,
  type: keyof typeof SEO_LIMITS,
): string | undefined {
  if (!text) return undefined;

  const trimmed = text.trim();
  if (!trimmed) return undefined;

  const limits = SEO_LIMITS[type];
  if (trimmed.length > limits.max) {
    // Truncate at word boundary near the limit
    const truncated = trimmed.substring(0, limits.max);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > limits.max * 0.8
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  return trimmed;
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
    url?: string;
  },
  pageOpenGraph?: any | null,
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
  } | null,
): SeoMetaTags {
  // Generate Open Graph data for generic pages
  const openGraph = pageData.url
    ? generatePageOpenGraph(
        globalSettings,
        pageOpenGraph,
        {
          title: pageData.title,
          description: pageData.description,
          url: pageData.url,
        },
        shopData,
      )
    : null;

  return {
    title: pageData.title,
    description: pageData.description,
    robots: generateRobotsDirective(globalSettings),
    canonical: pageData.canonical,
    openGraph,
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
    image?: string;
  },
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
  } | null,
): SeoMetaTags {
  // Use custom meta description if provided, otherwise fall back to product description
  const description =
    productPageData?.seoControls?.customMetaDescription ||
    productData.description;

  // Determine indexability and followability from product-specific settings
  const indexable = productPageData?.seoControls?.indexable ?? true;
  const followable = productPageData?.seoControls?.followable ?? true;

  // Generate Open Graph data using Sanity-first approach
  const openGraph = generateProductOpenGraph(
    globalSettings,
    productPageData,
    productData,
    shopData,
  );

  return {
    title: productPageData?.nameOverride || productData.title,
    description,
    robots: generateRobotsDirective(globalSettings, {
      indexable,
      followable,
    }),
    canonical: `/products/${productData.handle}`,
    image: productData.image,
    type: 'product',
    openGraph,
  };
}

/**
 * Generate meta tags for a collection page with both global and collection-specific SEO controls
 */
export function generateCollectionMetaTags(
  globalSettings: Settings | null,
  collectionPageData: CollectionPage | null,
  collectionData: {
    title: string;
    description?: string;
    handle: string;
    image?: string;
  },
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
  } | null,
  options?: {
    preventIndexing?: boolean;
  },
): SeoMetaTags {
  // Use custom meta description if provided, otherwise fall back to collection description
  const description =
    collectionPageData?.seoControls?.customMetaDescription ||
    collectionPageData?.descriptionOverride ||
    collectionData.description;

  // Determine indexability and followability from collection-specific settings
  const indexable = collectionPageData?.seoControls?.indexable ?? true;
  const followable = collectionPageData?.seoControls?.followable ?? true;

  // Generate Open Graph data using Sanity-first approach
  const openGraph = generateCollectionOpenGraph(
    globalSettings,
    collectionPageData,
    collectionData,
    shopData,
  );

  return {
    title:
      collectionPageData?.nameOverride || `${collectionData.title} Collection`,
    description,
    robots: generateRobotsDirective(globalSettings, {
      indexable,
      followable,
      preventIndexing: options?.preventIndexing,
    }),
    canonical: `/collections/${collectionData.handle}`,
    image: collectionData.image,
    type: 'website',
    openGraph,
  };
}

/**
 * Generate comprehensive SEO meta tags with automatic validation and optimization
 * Includes Open Graph, Twitter Cards, and other social media tags
 * Now integrates with Sanity-first Open Graph utilities
 */
export function generateComprehensiveSEOTags(
  seoData: SeoMetaTags,
  globalSettings: Settings | null,
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
    brand?: {
      logo?: {image?: {url?: string}};
      coverImage?: {image?: {url?: string}};
      squareLogo?: {image?: {url?: string}};
      colors?: {primary?: Array<{background?: string}>};
    };
  } | null,
): MetaDescriptor[] {
  const tags: MetaDescriptor[] = [];

  // Validate and optimize content
  const validatedTitle =
    validateSEOText(seoData.title, 'title') || seoData.title;
  const validatedDescription = validateSEOText(
    seoData.description,
    'description',
  );
  const validatedKeywords = seoData.keywords?.slice(0, SEO_LIMITS.keywords.max);

  // Basic meta tags
  tags.push({title: validatedTitle});

  if (validatedDescription) {
    tags.push({name: 'description', content: validatedDescription});
  }

  if (seoData.canonical) {
    tags.push({tagName: 'link', rel: 'canonical', href: seoData.canonical});
  }

  if (validatedKeywords?.length) {
    tags.push({name: 'keywords', content: validatedKeywords.join(', ')});
  }

  // Robots meta tag
  if (seoData.robots) {
    tags.push({name: 'robots', content: seoData.robots});
  }

  // Use Sanity-first Open Graph data if available, otherwise fallback to legacy method
  if (seoData.openGraph) {
    // Debug Open Graph data in development
    debugOpenGraph(seoData.openGraph);

    // Convert Open Graph data to meta tags
    const ogTags = openGraphToMetaTags(seoData.openGraph);
    ogTags.forEach((tag) => {
      if (tag.property) {
        tags.push({property: tag.property, content: tag.content});
      } else if (tag.name) {
        tags.push({name: tag.name, content: tag.content});
      }
    });
  } else {
    // Legacy fallback Open Graph generation
    tags.push({property: 'og:title', content: validatedTitle});
    tags.push({property: 'og:type', content: seoData.type || 'website'});

    if (shopData?.name || globalSettings?.title) {
      tags.push({
        property: 'og:site_name',
        content: shopData?.name || globalSettings?.title || '',
      });
    }

    if (validatedDescription) {
      tags.push({property: 'og:description', content: validatedDescription});
    }

    if (seoData.canonical) {
      tags.push({property: 'og:url', content: seoData.canonical});
    }

    // Image (prefer provided image, fallback to shop brand images)
    const image =
      seoData.image ||
      shopData?.brand?.coverImage?.image?.url ||
      shopData?.brand?.squareLogo?.image?.url ||
      shopData?.brand?.logo?.image?.url;

    if (image) {
      tags.push({property: 'og:image', content: image});
      tags.push({name: 'twitter:image', content: image});
      // Add image alt text for accessibility
      tags.push({
        property: 'og:image:alt',
        content: `${validatedTitle} - ${shopData?.name || globalSettings?.title || 'Sierra Nevada Friends of the Family'}`,
      });
    }

    // Twitter tags (fallback)
    tags.push({name: 'twitter:card', content: 'summary_large_image'});
    tags.push({name: 'twitter:title', content: validatedTitle});

    if (validatedDescription) {
      tags.push({name: 'twitter:description', content: validatedDescription});
    }
  }

  // Theme color from shop brand or default brewery color
  const themeColor =
    shopData?.brand?.colors?.primary?.[0]?.background || '#C8102E'; // Sierra Nevada red
  tags.push({name: 'theme-color', content: themeColor});

  // Additional SEO tags for brewery/members site
  tags.push({name: 'format-detection', content: 'telephone=no'});
  tags.push({name: 'apple-mobile-web-app-capable', content: 'yes'});
  tags.push({
    name: 'apple-mobile-web-app-status-bar-style',
    content: 'black-translucent',
  });

  return tags;
}

/**
 * Convert SEO meta tags to Remix MetaFunction format (legacy support)
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
