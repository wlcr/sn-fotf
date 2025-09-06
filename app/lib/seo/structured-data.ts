/**
 * JSON-LD Structured Data Utilities for Sierra Nevada Friends of the Family
 *
 * Generates structured data (JSON-LD) for SEO and rich snippets while respecting
 * Sanity CMS global SEO controls for the members-only brewery storefront.
 *
 * Adapted from Rubato Wines implementation with Sanity CMS integration.
 */

import type {Settings} from '~/types/sanity';
import {
  isSiteDiscoverable,
  isRobotsCrawlingAllowed,
} from '~/lib/sanity/queries/settings';

/**
 * Base structured data interface
 */
export interface BaseStructuredData {
  '@context': string;
  '@type': string;
}

/**
 * Organization structured data
 */
export interface OrganizationData extends BaseStructuredData {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: PostalAddressData;
  contactPoint?: ContactPointData[];
  sameAs?: string[];
}

/**
 * Postal address structured data
 */
export interface PostalAddressData extends BaseStructuredData {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

/**
 * Contact point structured data
 */
export interface ContactPointData extends BaseStructuredData {
  '@type': 'ContactPoint';
  telephone?: string;
  contactType: string;
  email?: string;
  availableLanguage?: string[];
}

/**
 * Website structured data
 */
export interface WebsiteData extends BaseStructuredData {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: OrganizationData;
  potentialAction?: SearchActionData[];
}

/**
 * Search action structured data
 */
export interface SearchActionData extends BaseStructuredData {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

/**
 * Product structured data
 */
export interface ProductData extends BaseStructuredData {
  '@type': 'Product';
  name: string;
  description?: string;
  image?: string[];
  brand?: BrandData | string;
  sku?: string;
  gtin?: string;
  offers?: OfferData[];
  aggregateRating?: AggregateRatingData;
  review?: ReviewData[];
}

/**
 * Brand structured data
 */
export interface BrandData extends BaseStructuredData {
  '@type': 'Brand';
  name: string;
  logo?: string;
  description?: string;
}

/**
 * Offer structured data
 */
export interface OfferData extends BaseStructuredData {
  '@type': 'Offer';
  price: string;
  priceCurrency: string;
  availability: string;
  seller?: OrganizationData | string;
  validFrom?: string;
  validThrough?: string;
}

/**
 * Aggregate rating structured data
 */
export interface AggregateRatingData extends BaseStructuredData {
  '@type': 'AggregateRating';
  ratingValue: string;
  bestRating?: string;
  worstRating?: string;
  ratingCount: string;
}

/**
 * Review structured data
 */
export interface ReviewData extends BaseStructuredData {
  '@type': 'Review';
  reviewRating: RatingData;
  author: PersonData | string;
  reviewBody?: string;
  datePublished?: string;
}

/**
 * Rating structured data
 */
export interface RatingData extends BaseStructuredData {
  '@type': 'Rating';
  ratingValue: string;
  bestRating?: string;
  worstRating?: string;
}

/**
 * Person structured data
 */
export interface PersonData extends BaseStructuredData {
  '@type': 'Person';
  name: string;
  email?: string;
  url?: string;
}

/**
 * Breadcrumb list structured data
 */
export interface BreadcrumbListData extends BaseStructuredData {
  '@type': 'BreadcrumbList';
  itemListElement: ListItemData[];
}

/**
 * List item structured data
 */
export interface ListItemData extends BaseStructuredData {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

/**
 * Article structured data
 */
export interface ArticleData extends BaseStructuredData {
  '@type': 'Article';
  headline: string;
  description?: string;
  author: PersonData | OrganizationData | string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url: string;
  publisher?: OrganizationData;
}

/**
 * Collection page structured data
 */
export interface CollectionPageData extends BaseStructuredData {
  '@type': 'CollectionPage';
  name: string;
  description?: string;
  url: string;
  mainEntity?: ProductData[];
  breadcrumb?: BreadcrumbListData;
}

/**
 * Generate organization structured data from Sanity settings and Shopify shop data
 * Respects Sanity global SEO controls for members-only site
 */
export function generateOrganizationData(
  sanitySettings: Settings | null,
  shopData?: {
    name: string;
    primaryDomain: {url: string};
    brand?: {
      logo?: {image?: {url?: string}};
      shortDescription?: string;
    } | null;
    description?: string;
  } | null,
): OrganizationData | null {
  // Respect Sanity global SEO controls - don't generate structured data if site not discoverable
  if (!isSiteDiscoverable(sanitySettings)) {
    return null;
  }

  const siteName = sanitySettings?.title || shopData?.name;
  const siteUrl =
    shopData?.primaryDomain?.url ||
    sanitySettings?.description ||
    'https://friends.sierranevada.com';

  if (!siteName) return null;

  const org: OrganizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
  };

  // Add logo from Sanity settings or Shopify brand
  const logoUrl = shopData?.brand?.logo?.image?.url;
  if (logoUrl) {
    org.logo = logoUrl;
  }

  // Prefer Sanity description over Shopify
  const description =
    sanitySettings?.description ||
    shopData?.brand?.shortDescription ||
    shopData?.description;

  if (description) {
    org.description = description;
  }

  // Add contact information from Sanity settings
  if (sanitySettings?.contactEmail || sanitySettings?.phoneNumber) {
    org.contactPoint = [];

    if (sanitySettings.contactEmail) {
      org.contactPoint.push({
        '@context': 'https://schema.org',
        '@type': 'ContactPoint',
        email: sanitySettings.contactEmail,
        contactType: 'customer service',
      });
    }

    if (sanitySettings.phoneNumber) {
      org.contactPoint.push({
        '@context': 'https://schema.org',
        '@type': 'ContactPoint',
        telephone: sanitySettings.phoneNumber,
        contactType: 'customer service',
      });
    }
  }

  // Add social media links from Sanity settings
  const socialLinks = [];
  if (sanitySettings?.socialMedia?.instagram)
    socialLinks.push(sanitySettings.socialMedia.instagram);
  if (sanitySettings?.socialMedia?.facebook)
    socialLinks.push(sanitySettings.socialMedia.facebook);
  if (sanitySettings?.socialMedia?.twitter)
    socialLinks.push(sanitySettings.socialMedia.twitter);
  if (sanitySettings?.socialMedia?.youtube)
    socialLinks.push(sanitySettings.socialMedia.youtube);
  if (sanitySettings?.socialMedia?.linkedin)
    socialLinks.push(sanitySettings.socialMedia.linkedin);

  if (socialLinks.length > 0) {
    org.sameAs = socialLinks;
  }

  return org;
}

/**
 * Generate website structured data with Sanity integration
 * Respects global SEO controls and only includes search action if appropriate
 */
export function generateWebsiteData(
  sanitySettings: Settings | null,
  shopData?: {
    name: string;
    primaryDomain: {url: string};
    brand?: {
      shortDescription?: string;
    } | null;
    description?: string;
  } | null,
  includeSearchAction = true,
): WebsiteData | null {
  // Respect Sanity global SEO controls
  if (!isSiteDiscoverable(sanitySettings)) {
    return null;
  }

  const siteName = sanitySettings?.title || shopData?.name;
  const siteUrl =
    shopData?.primaryDomain?.url || 'https://friends.sierranevada.com';

  if (!siteName) return null;

  const website: WebsiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  };

  // Prefer Sanity description
  const description =
    sanitySettings?.description ||
    shopData?.brand?.shortDescription ||
    shopData?.description;

  if (description) {
    website.description = description;
  }

  // Add publisher (organization)
  const org = generateOrganizationData(sanitySettings, shopData);
  if (org) {
    website.publisher = org;
  }

  // Only add search action if crawling is allowed and search should be discoverable
  const allowCrawling = isRobotsCrawlingAllowed(sanitySettings);
  if (includeSearchAction && allowCrawling) {
    website.potentialAction = [
      {
        '@context': 'https://schema.org',
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    ];
  }

  return website;
}

/**
 * Generate breadcrumb structured data
 * Always generated regardless of SEO controls as it aids navigation
 */
export function generateBreadcrumbData(
  breadcrumbs: Array<{name: string; url: string}>,
  baseUrl: string,
): BreadcrumbListData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@context': 'https://schema.org',
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`,
    })),
  };
}

/**
 * Generate product structured data with Sanity SEO controls integration
 */
export function generateProductData(
  product: {
    name: string;
    description?: string;
    image?: string;
    brand?: string;
    sku?: string;
    price?: string;
    currency?: string;
    availability?: string;
    url: string;
  },
  sanitySettings: Settings | null,
): ProductData | null {
  // Respect Sanity global SEO controls
  if (!isSiteDiscoverable(sanitySettings)) {
    return null;
  }

  const productData: ProductData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
  };

  if (product.description) {
    productData.description = product.description;
  }

  if (product.image) {
    productData.image = [product.image];
  }

  if (product.brand) {
    productData.brand = {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name: product.brand,
    };
  }

  if (product.sku) {
    productData.sku = product.sku;
  }

  // Add offer if price information is available
  if (product.price && product.currency) {
    productData.offers = [
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: product.availability || 'https://schema.org/InStock',
      },
    ];
  }

  return productData;
}

/**
 * Generate article structured data
 */
export function generateArticleData(
  article: {
    headline: string;
    description?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    image?: string;
    url: string;
  },
  sanitySettings: Settings | null,
): ArticleData | null {
  // Respect Sanity global SEO controls
  if (!isSiteDiscoverable(sanitySettings)) {
    return null;
  }

  const articleData: ArticleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    url: article.url,
    author:
      article.author ||
      sanitySettings?.companyName ||
      'Sierra Nevada Brewing Co.',
  };

  if (article.description) {
    articleData.description = article.description;
  }

  if (article.datePublished) {
    articleData.datePublished = article.datePublished;
  }

  if (article.dateModified) {
    articleData.dateModified = article.dateModified;
  }

  if (article.image) {
    articleData.image = article.image;
  }

  // Add publisher (organization)
  const org = generateOrganizationData(sanitySettings, null);
  if (org) {
    articleData.publisher = org;
  }

  return articleData;
}

/**
 * Convert structured data object to JSON-LD string
 */
export function structuredDataToJsonLd(data: BaseStructuredData): string {
  return JSON.stringify(data, null, 0);
}

/**
 * Create multiple structured data objects and combine them
 * Filters out null values (when SEO controls prevent generation)
 */
export function combineStructuredData(
  ...dataObjects: (BaseStructuredData | null)[]
): BaseStructuredData[] {
  return dataObjects.filter(
    (data): data is BaseStructuredData => data !== null,
  );
}

/**
 * Generate common site-wide structured data
 * Respects Sanity global SEO controls - returns empty array if site not discoverable
 */
export function generateSiteStructuredData(
  sanitySettings: Settings | null,
  shopData?: {
    name: string;
    primaryDomain: {url: string};
    brand?: {
      logo?: {image?: {url?: string}};
      shortDescription?: string;
    } | null;
    description?: string;
  } | null,
  options: {
    includeWebsite?: boolean;
    includeOrganization?: boolean;
    includeSearchAction?: boolean;
  } = {},
): BaseStructuredData[] {
  // Respect Sanity global SEO controls
  if (!isSiteDiscoverable(sanitySettings)) {
    return [];
  }

  const {
    includeWebsite = true,
    includeOrganization = true,
    includeSearchAction = true,
  } = options;

  const structuredData: BaseStructuredData[] = [];

  if (includeOrganization) {
    const org = generateOrganizationData(sanitySettings, shopData);
    if (org) structuredData.push(org);
  }

  if (includeWebsite) {
    const website = generateWebsiteData(
      sanitySettings,
      shopData,
      includeSearchAction,
    );
    if (website) structuredData.push(website);
  }

  return structuredData;
}

/**
 * Helper to check if structured data should be generated
 * Useful for conditional rendering in components
 */
export function shouldGenerateStructuredData(
  sanitySettings: Settings | null,
): boolean {
  return isSiteDiscoverable(sanitySettings);
}
