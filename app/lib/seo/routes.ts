/**
 * Route-Based SEO Configuration for Sierra Nevada Friends of the Family
 *
 * Centralized SEO settings for specific routes while respecting Sanity CMS
 * global SEO controls. Designed for the members-only brewery storefront
 * where certain areas should not be discoverable by search engines.
 *
 * Adapted from Rubato Wines implementation with Sanity integration.
 */

import type {Settings} from '~/studio/sanity.types';
import {isSiteDiscoverable} from '~/lib/sanity/queries/settings';

/**
 * Robots directive options
 */
export type RobotsDirective =
  | 'index'
  | 'noindex'
  | 'follow'
  | 'nofollow'
  | 'archive'
  | 'noarchive'
  | 'snippet'
  | 'nosnippet'
  | 'imageindex'
  | 'noimageindex'
  | 'translate'
  | 'notranslate';

/**
 * Route-specific SEO configuration
 */
export interface RouteSEOConfig {
  noIndex?: boolean;
  robots?: RobotsDirective[] | string;
  reason?: string; // Documentation for why this rule exists
  priority?: number; // For sitemap generation
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
}

/**
 * SEO settings for specific routes
 * Routes are matched using exact paths or patterns
 */
export const ROUTE_SEO_CONFIG: Record<string, RouteSEOConfig> = {
  // Account pages - should never be indexed (member privacy)
  '/account': {
    noIndex: true,
    reason: 'Member account pages should not be indexed for privacy',
  },
  '/account/login': {
    noIndex: true,
    reason: 'Login page should not be indexed',
  },
  '/account/register': {
    noIndex: true,
    reason: 'Registration page should not be indexed',
  },
  '/account/logout': {
    noIndex: true,
    reason: 'Logout page should not be indexed',
  },
  '/account/profile': {
    noIndex: true,
    reason: 'Member profile page should not be indexed for privacy',
  },
  '/account/orders': {
    noIndex: true,
    reason: 'Member orders page should not be indexed for privacy',
  },
  '/account/addresses': {
    noIndex: true,
    reason: 'Member addresses page should not be indexed for privacy',
  },

  // Cart and checkout - should not be indexed (commerce privacy)
  '/cart': {
    noIndex: true,
    reason: 'Cart page should not be indexed',
  },
  '/checkout': {
    noIndex: true,
    reason: 'Checkout page should not be indexed',
  },

  // Search results - noindex but follow links
  '/search': {
    robots: ['noindex', 'follow'],
    reason: 'Search results should not be indexed but links should be followed',
  },

  // API routes - should not be indexed
  '/api': {
    noIndex: true,
    reason: 'API endpoints should not be indexed',
  },
  '/api/*': {
    noIndex: true,
    reason: 'API endpoints should not be indexed',
  },

  // Thank you and confirmation pages
  '/thank-you': {
    noIndex: true,
    reason: 'Thank you pages should not be indexed',
  },
  '/order-confirmation': {
    noIndex: true,
    reason: 'Order confirmation pages should not be indexed',
  },
  '/order-confirmation/*': {
    noIndex: true,
    reason: 'Order confirmation pages should not be indexed',
  },

  // Development and testing pages
  '/dev': {
    noIndex: true,
    reason: 'Development pages should not be indexed',
  },
  '/dev/*': {
    noIndex: true,
    reason: 'Development pages should not be indexed',
  },
  '/test': {
    noIndex: true,
    reason: 'Test pages should not be indexed',
  },
  '/test/*': {
    noIndex: true,
    reason: 'Test pages should not be indexed',
  },
  '/preview': {
    noIndex: true,
    reason: 'Preview pages should not be indexed',
  },
  '/preview/*': {
    noIndex: true,
    reason: 'Preview pages should not be indexed',
  },

  // Members-only specific routes (may be conditionally discoverable)
  '/members': {
    noIndex: true, // Default to private, but can be overridden by global settings
    reason:
      'Members-only section - default to private but respects global SEO settings',
  },
  '/members/*': {
    noIndex: true,
    reason:
      'Members-only content - default to private but respects global SEO settings',
  },

  // Sitemap and robots (allow crawling for these utility routes)
  '/sitemap.xml': {
    robots: ['noindex', 'follow'], // Don't index the sitemap itself
    reason: 'Sitemap should be accessible but not indexed',
    changefreq: 'daily',
  },
  '/robots.txt': {
    robots: ['noindex', 'follow'], // Don't index robots.txt
    reason: 'Robots.txt should be accessible but not indexed',
  },

  // High priority pages for SEO (when site is discoverable)
  '/': {
    priority: 1.0,
    changefreq: 'weekly',
    reason: 'Homepage - highest priority for SEO',
  },
  '/collections': {
    priority: 0.8,
    changefreq: 'daily',
    reason: 'Collections index - high priority for product discovery',
  },
  '/products': {
    priority: 0.8,
    changefreq: 'daily',
    reason: 'Products - high priority for product discovery',
  },

  // Policy pages (usually low priority but should be indexed if site is discoverable)
  '/pages/privacy-policy': {
    priority: 0.3,
    changefreq: 'monthly',
    reason: 'Privacy policy - low priority but important for legal compliance',
  },
  '/pages/terms-of-service': {
    priority: 0.3,
    changefreq: 'monthly',
    reason:
      'Terms of service - low priority but important for legal compliance',
  },
  '/pages/shipping-policy': {
    priority: 0.3,
    changefreq: 'monthly',
    reason: 'Shipping policy - low priority but important for customer service',
  },
};

/**
 * Get SEO configuration for a specific route
 * Integrates with Sanity global SEO settings
 */
export function getRouteSEOConfig(
  pathname: string,
  globalSettings: Settings | null = null,
): RouteSEOConfig | null {
  // Try exact match first
  const exactMatch = ROUTE_SEO_CONFIG[pathname];
  if (exactMatch) {
    return applyGlobalSEOSettings(exactMatch, globalSettings, pathname);
  }

  // Try pattern matching for dynamic routes
  for (const [pattern, config] of Object.entries(ROUTE_SEO_CONFIG)) {
    if (matchesPattern(pathname, pattern)) {
      return applyGlobalSEOSettings(config, globalSettings, pathname);
    }
  }

  return null;
}

/**
 * Apply global Sanity SEO settings to route-specific config
 * Global settings take precedence for site-wide discoverability
 */
function applyGlobalSEOSettings(
  routeConfig: RouteSEOConfig,
  globalSettings: Settings | null,
  pathname: string,
): RouteSEOConfig {
  // If site is globally not discoverable, override all route settings to noindex
  if (!isSiteDiscoverable(globalSettings)) {
    return {
      ...routeConfig,
      noIndex: true,
      robots: 'noindex, nofollow',
      reason: `${routeConfig.reason} + Site globally set to non-discoverable`,
    };
  }

  // For members-only routes, respect the global setting but default to private
  if (pathname.startsWith('/members') && routeConfig.noIndex) {
    // If site is discoverable, members section could potentially be discoverable too
    // But we default to private unless explicitly configured otherwise
    return {
      ...routeConfig,
      reason: `${routeConfig.reason} (Site is discoverable but members section defaults to private)`,
    };
  }

  return routeConfig;
}

/**
 * Check if a pathname matches a pattern
 * Supports basic wildcard matching with *
 */
function matchesPattern(pathname: string, pattern: string): boolean {
  // Convert pattern to regex
  // Replace * with .* and escape other regex special characters
  const regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
    .replace(/\*/g, '.*'); // Replace * with .*

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
}

/**
 * Helper to check if a route should be noindexed
 * Considers both route-specific and global Sanity settings
 */
export function shouldNoIndex(
  pathname: string,
  globalSettings: Settings | null = null,
): boolean {
  const config = getRouteSEOConfig(pathname, globalSettings);

  if (config?.noIndex) {
    return true;
  }

  if (config?.robots) {
    const robotsDirectives = Array.isArray(config.robots)
      ? config.robots
      : [config.robots];
    return robotsDirectives.includes('noindex');
  }

  // If site is globally not discoverable, everything should be noindexed
  if (!isSiteDiscoverable(globalSettings)) {
    return true;
  }

  return false;
}

/**
 * Helper to get custom robots directives for a route
 * Integrates with global Sanity SEO settings
 */
export function getRouteRobots(
  pathname: string,
  globalSettings: Settings | null = null,
): RobotsDirective[] | string | undefined {
  const config = getRouteSEOConfig(pathname, globalSettings);
  return config?.robots;
}

/**
 * Get sitemap priority for a route (for sitemap.xml generation)
 */
export function getRoutePriority(pathname: string): number {
  const config = ROUTE_SEO_CONFIG[pathname];
  return config?.priority ?? 0.5; // Default priority
}

/**
 * Get change frequency for a route (for sitemap.xml generation)
 */
export function getRouteChangeFreq(pathname: string): string {
  const config = ROUTE_SEO_CONFIG[pathname];
  return config?.changefreq ?? 'weekly'; // Default change frequency
}

/**
 * Get all routes that should be included in sitemap
 * Only returns routes that would be indexable based on global settings
 */
export function getSitemapRoutes(globalSettings: Settings | null): Array<{
  pathname: string;
  priority: number;
  changefreq: string;
}> {
  if (!isSiteDiscoverable(globalSettings)) {
    return []; // No sitemap if site is not discoverable
  }

  const routes = [];

  for (const [pathname, config] of Object.entries(ROUTE_SEO_CONFIG)) {
    // Skip routes with wildcards or that are explicitly noindexed
    if (pathname.includes('*') || config.noIndex) {
      continue;
    }

    // Skip API and admin routes
    if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
      continue;
    }

    routes.push({
      pathname,
      priority: config.priority ?? 0.5,
      changefreq: config.changefreq ?? 'weekly',
    });
  }

  return routes;
}

/**
 * Debug function to list all SEO rules for development
 */
export function debugSEORoutes(globalSettings: Settings | null = null): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Development debugging - commented to avoid lint warnings
  // console.group('🔍 SEO Route Configuration');
  // console.log('Global Site Discoverable:', isSiteDiscoverable(globalSettings));

  for (const [pathname, config] of Object.entries(ROUTE_SEO_CONFIG)) {
    const appliedConfig = getRouteSEOConfig(pathname, globalSettings);
    // console.log(`${pathname}:`, {
    //   noIndex: appliedConfig?.noIndex ?? false,
    //   robots: appliedConfig?.robots,
    //   reason: appliedConfig?.reason,
    //   priority: config.priority
    // });
  }

  // console.groupEnd();
}
