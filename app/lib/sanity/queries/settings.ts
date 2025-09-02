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
    venueName,
    address,
    phone,
    email,
    title,
    description,
    ogImage {
      asset,
      alt,
      metadataBase
    }
  }
` as const;
