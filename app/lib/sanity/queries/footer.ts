/**
 * Footer Sanity Queries
 *
 * GROQ queries for footer component data including navigation menu and legal links.
 */

/**
 * Footer query - gets footer configuration with menu and legal links
 *
 * @returns Footer data with navigation menu and legal page links
 */
export const FOOTER_QUERY = `
  *[_type == "footer"][0] {
    logo {
      asset,
      alt,
      hotspot,
      crop
    },
    internalLinks[] {
      title,
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
      }
    },
    externalLinks[] {
      title,
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
      }
    }
  }
` as const;
