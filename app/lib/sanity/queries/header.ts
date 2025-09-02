/**
 * Header Sanity Queries
 *
 * GROQ queries for header component data including logo, CTA button, and announcement bar.
 */

/**
 * Header query - gets header configuration with all necessary data
 *
 * @returns Header data with logo, CTA button, and announcement bar
 */
export const HEADER_QUERY = `
  *[_type == "header"][0] {
    logo {
      asset,
      alt,
      hotspot,
      crop
    },
    ctaButton {
      text,
      link {
        _type,
        linkType,
        href,
        page->{
          slug
        },
        productPage->{
          slug
        },
        openInNewTab
      },
      enabled
    },
    announcementBar {
      text,
      link {
        _type,
        linkType,
        href,
        page->{
          slug
        },
        productPage->{
          slug
        },
        openInNewTab
      },
      enabled
    }
  }
` as const;
