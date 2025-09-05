/**
 * Open Graph Utilities for Sierra Nevada Friends of the Family
 *
 * Prioritizes Sanity CMS Open Graph data with intelligent fallbacks to Shopify data.
 * Provides content editors complete control over social media sharing appearance.
 */

import type {
  Settings,
  ProductPage,
  CollectionPage,
} from '~/studio/sanity.types';
import {isSiteDiscoverable} from '~/lib/sanity/queries/settings';
import {getSanityImageUrlWithEnv} from '~/lib/sanity';

/**
 * Open Graph meta tag data structure
 */
export interface OpenGraphData {
  title: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  type: 'website' | 'article' | 'product';
  url?: string;
  siteName?: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  facebookAppId?: string;
  noIndex?: boolean;
}

/**
 * Generate comprehensive Open Graph data with Sanity-first approach
 */
export function generateOpenGraphData(
  sanitySettings: Settings | null,
  pageOpenGraph: any | null, // OpenGraph from ProductPage/CollectionPage
  fallbackData: {
    title: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    url?: string;
  },
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
  } | null,
): OpenGraphData | null {
  // Respect global SEO settings
  if (!isSiteDiscoverable(sanitySettings)) {
    return null;
  }

  // Check if page-level Open Graph is set to noIndex
  if (pageOpenGraph?.noIndex) {
    return null;
  }

  // Build Open Graph data with Sanity-first priority
  const ogData: OpenGraphData = {
    // Title: Page OG > Fallback title
    title: pageOpenGraph?.title || fallbackData.title,

    // Description: Page OG > Fallback description
    description: pageOpenGraph?.description || fallbackData.description,

    // Type: Page OG > Fallback type > default website
    type: pageOpenGraph?.type || fallbackData.type || 'website',

    // URL: Fallback URL (from route)
    url: fallbackData.url,

    // Site name: Global OG > Shop name > fallback
    siteName:
      sanitySettings?.openGraph?.siteName ||
      shopData?.name ||
      'Sierra Nevada Friends of the Family',

    // Twitter Card: Page OG > default large image
    twitterCard: pageOpenGraph?.twitterCard || 'summary_large_image',

    // Twitter handle from global settings
    twitterSite: sanitySettings?.openGraph?.twitterHandle
      ? `@${sanitySettings.openGraph.twitterHandle}`
      : undefined,

    // Facebook App ID from global settings
    facebookAppId: sanitySettings?.openGraph?.facebookAppId || undefined,
  };

  // Handle images with Sanity CDN optimization
  const ogImage = getOptimalOpenGraphImage(
    pageOpenGraph?.image, // Page-specific image
    sanitySettings?.openGraph?.defaultImage, // Global default
    fallbackData.image, // Shopify fallback
  );

  if (ogImage) {
    ogData.image = ogImage;
  }

  return ogData;
}

/**
 * Get optimal Open Graph image with Sanity CDN optimization
 * Prioritizes Sanity images for better control and performance
 */
function getOptimalOpenGraphImage(
  pageImage: any, // Sanity image from page
  globalDefaultImage: any, // Global default from settings
  fallbackImageUrl?: string, // Shopify image URL
): OpenGraphData['image'] | null {
  // Priority 1: Page-specific Sanity image
  if (pageImage?.asset) {
    const url = getSanityImageUrlWithEnv(pageImage, {
      width: 1200,
      height: 630,
      fit: 'crop',
      format: 'jpg',
      quality: 85,
    });

    if (url) {
      return {
        url,
        alt: pageImage.alt || 'Social media preview',
        width: 1200,
        height: 630,
      };
    }
  }

  // Priority 2: Global default Sanity image
  if (globalDefaultImage?.asset) {
    const url = getSanityImageUrlWithEnv(globalDefaultImage, {
      width: 1200,
      height: 630,
      fit: 'crop',
      format: 'jpg',
      quality: 85,
    });

    if (url) {
      return {
        url,
        alt: globalDefaultImage.alt || 'Sierra Nevada Friends of the Family',
        width: 1200,
        height: 630,
      };
    }
  }

  // Priority 3: Fallback to Shopify image
  if (fallbackImageUrl) {
    // For Shopify images, we can't optimize through Sanity but can still use them
    return {
      url: fallbackImageUrl,
      alt: 'Product image',
    };
  }

  return null;
}

/**
 * Generate Open Graph meta tags for products
 */
export function generateProductOpenGraph(
  sanitySettings: Settings | null,
  productPageData: ProductPage | null,
  productData: {
    title: string;
    description?: string;
    image?: string;
    handle: string;
  },
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
  } | null,
): OpenGraphData | null {
  const displayTitle = productPageData?.nameOverride || productData.title;
  const baseUrl =
    shopData?.primaryDomain?.url || 'https://friends.sierranevada.com';

  return generateOpenGraphData(
    sanitySettings,
    productPageData?.openGraph,
    {
      title: displayTitle,
      description: productData.description,
      image: productData.image,
      type: 'product',
      url: `${baseUrl}/products/${productData.handle}`,
    },
    shopData,
  );
}

/**
 * Generate Open Graph meta tags for collections
 */
export function generateCollectionOpenGraph(
  sanitySettings: Settings | null,
  collectionPageData: CollectionPage | null,
  collectionData: {
    title: string;
    description?: string;
    image?: string;
    handle: string;
  },
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
  } | null,
): OpenGraphData | null {
  const displayTitle = collectionPageData?.nameOverride || collectionData.title;
  const displayDescription =
    collectionPageData?.descriptionOverride || collectionData.description;
  const baseUrl =
    shopData?.primaryDomain?.url || 'https://friends.sierranevada.com';

  return generateOpenGraphData(
    sanitySettings,
    collectionPageData?.openGraph,
    {
      title: displayTitle,
      description: displayDescription,
      image: collectionData.image,
      type: 'website',
      url: `${baseUrl}/collections/${collectionData.handle}`,
    },
    shopData,
  );
}

/**
 * Generate Open Graph meta tags for generic pages
 */
export function generatePageOpenGraph(
  sanitySettings: Settings | null,
  pageOpenGraph: any | null,
  pageData: {
    title: string;
    description?: string;
    url: string;
  },
  shopData?: {
    name?: string;
    primaryDomain?: {url: string};
  } | null,
): OpenGraphData | null {
  return generateOpenGraphData(
    sanitySettings,
    pageOpenGraph,
    {
      title: pageData.title,
      description: pageData.description,
      type: 'website',
      url: pageData.url,
    },
    shopData,
  );
}

/**
 * Convert Open Graph data to HTML meta tags array
 */
export function openGraphToMetaTags(ogData: OpenGraphData): Array<{
  property?: string;
  name?: string;
  content: string;
}> {
  const tags: Array<{property?: string; name?: string; content: string}> = [];

  // Basic Open Graph tags
  tags.push({property: 'og:title', content: ogData.title});
  tags.push({property: 'og:type', content: ogData.type});

  if (ogData.description) {
    tags.push({property: 'og:description', content: ogData.description});
  }

  if (ogData.url) {
    tags.push({property: 'og:url', content: ogData.url});
  }

  if (ogData.siteName) {
    tags.push({property: 'og:site_name', content: ogData.siteName});
  }

  // Image tags
  if (ogData.image) {
    tags.push({property: 'og:image', content: ogData.image.url});
    tags.push({property: 'og:image:alt', content: ogData.image.alt});

    if (ogData.image.width) {
      tags.push({
        property: 'og:image:width',
        content: ogData.image.width.toString(),
      });
    }

    if (ogData.image.height) {
      tags.push({
        property: 'og:image:height',
        content: ogData.image.height.toString(),
      });
    }
  }

  // Twitter Card tags
  tags.push({name: 'twitter:card', content: ogData.twitterCard});
  tags.push({name: 'twitter:title', content: ogData.title});

  if (ogData.description) {
    tags.push({name: 'twitter:description', content: ogData.description});
  }

  if (ogData.image) {
    tags.push({name: 'twitter:image', content: ogData.image.url});
    tags.push({name: 'twitter:image:alt', content: ogData.image.alt});
  }

  if (ogData.twitterSite) {
    tags.push({name: 'twitter:site', content: ogData.twitterSite});
  }

  // Facebook specific tags
  if (ogData.facebookAppId) {
    tags.push({property: 'fb:app_id', content: ogData.facebookAppId});
  }

  return tags;
}

/**
 * Utility to check if Open Graph data should be generated
 * Respects both global and page-level settings
 */
export function shouldGenerateOpenGraph(
  sanitySettings: Settings | null,
  pageOpenGraph?: any | null,
): boolean {
  // Must be globally discoverable
  if (!isSiteDiscoverable(sanitySettings)) {
    return false;
  }

  // Page-level noIndex override
  if (pageOpenGraph?.noIndex) {
    return false;
  }

  return true;
}

/**
 * Debug utility for development
 */
export function debugOpenGraph(ogData: OpenGraphData | null): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.group('🔍 Open Graph Debug');

  if (!ogData) {
    console.log(
      '❌ Open Graph data not generated (site not discoverable or page set to noIndex)',
    );
  } else {
    console.log('✅ Open Graph data generated:');
    console.table({
      title: ogData.title,
      description: ogData.description?.slice(0, 50) + '...',
      type: ogData.type,
      image: ogData.image ? '✅ Image set' : '❌ No image',
      siteName: ogData.siteName,
      twitterCard: ogData.twitterCard,
    });

    if (ogData.image) {
      console.log('🖼️ Image details:', ogData.image);
    }
  }

  console.groupEnd();
}
