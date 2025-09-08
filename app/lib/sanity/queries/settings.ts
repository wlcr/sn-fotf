/**
 * Settings Sanity Queries
 *
 * GROQ queries for global site settings including site metadata, contact info, and branding.
 */
import type {Settings} from '~/types/sanity';

/**
 * Settings query - gets global site settings
 *
 * @returns Global site settings including metadata, contact info, and SEO data
 */
export const SETTINGS_QUERY = `
  *[_type == "settings"][0] {
    // SEO & Metadata
    title,
    description,
    keywords,
    openGraph {
      siteName,
      defaultImage {
        asset,
        alt
      },
      twitterHandle,
      facebookAppId
    },
    
    // Analytics & Tracking
    gtmContainerId,
    ga4MeasurementId,
    facebookPixelId,
    
    // Company Info
    companyName,
    contactEmail,
    phoneNumber,
    address,
    
    // Social Media
    socialMedia {
      instagram,
      facebook,
      twitter,
      youtube,
      linkedin
    },
    
    // Legal & Compliance
    cookieConsentMessage,
    showCookieConsent,
    
    // Global SEO Controls
    globalSeoControls {
      siteDiscoverable,
      allowRobotsCrawling,
      customRobotsDirectives,
      seoNote
    }
  }
` as const;

/**
 * Helper functions to access specific settings groups
 * These provide type safety and organization while still using a single query
 */

/**
 * Get SEO & metadata settings
 */
export function getSeoSettings(settings: Settings | null) {
  if (!settings) return null;

  return {
    title: settings.title,
    description: settings.description,
    keywords: settings.keywords,
    openGraph: settings.openGraph,
  };
}

/**
 * Get analytics & tracking settings
 */
export function getAnalyticsSettings(settings: Settings | null) {
  if (!settings) return null;

  return {
    gtmContainerId: settings.gtmContainerId,
    ga4MeasurementId: settings.ga4MeasurementId,
    facebookPixelId: settings.facebookPixelId,
  };
}

/**
 * Get company information settings
 */
export function getCompanySettings(settings: Settings | null) {
  if (!settings) return null;

  return {
    companyName: settings.companyName,
    contactEmail: settings.contactEmail,
    phoneNumber: settings.phoneNumber,
    address: settings.address,
  };
}

/**
 * Get social media settings
 */
export function getSocialSettings(settings: Settings | null) {
  if (!settings) return null;

  return settings.socialMedia || null;
}

/**
 * Get legal & compliance settings
 */
export function getLegalSettings(settings: Settings | null) {
  if (!settings) return null;

  return {
    cookieConsentMessage: settings.cookieConsentMessage,
    showCookieConsent: settings.showCookieConsent,
  };
}

/**
 * Get global SEO controls for site-wide search engine discoverability
 */
export function getGlobalSeoControls(settings: Settings | null) {
  if (!settings) return null;

  return settings.globalSeoControls || null;
}

/**
 * Check if the site should be discoverable by search engines
 * This is the main function to determine global SEO strategy
 */
export function isSiteDiscoverable(settings: Settings | null): boolean {
  const seoControls = getGlobalSeoControls(settings);
  return seoControls?.siteDiscoverable ?? false; // Default to false for members-only sites
}

/**
 * Check if search engine crawling is allowed
 */
export function isRobotsCrawlingAllowed(settings: Settings | null): boolean {
  const seoControls = getGlobalSeoControls(settings);
  return seoControls?.allowRobotsCrawling ?? false;
}
