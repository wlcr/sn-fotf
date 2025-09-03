/**
 * Settings Sanity Queries
 *
 * GROQ queries for global site settings including site metadata, contact info, and branding.
 */

/**
 * Settings query - gets global site configuration
 *
 * @returns Global site settings including metadata, contact info, and SEO data
 */
export const SETTINGS_QUERY = `
  *[_type == "settings"][0] {
    // SEO & Metadata
    title,
    description,
    keywords,
    ogImage {
      asset,
      alt
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
    showCookieConsent
  }
` as const;
