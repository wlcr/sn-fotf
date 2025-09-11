import groq from 'groq';

/**
 * GROQ query for fetching the announcement bar singleton
 * Since this is a singleton, we can directly query for the first (and only) document
 */
export const ANNOUNCEMENT_BAR_QUERY = groq`
  *[_type == "announcementBar" && _id == "announcementBar"][0] {
    enabled,
    content,
    wrapperLink {
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
`;
