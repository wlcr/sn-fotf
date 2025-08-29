import {Link} from 'studio/sanity.types';

// Depending on the type of link, we need to fetch the corresponding page, post, or URL.  Otherwise return null.
export function linkResolver(link: Link | undefined) {
  if (!link) return null;

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = 'href';
  }

  console.log('link!!!', link);

  switch (link.linkType) {
    case 'home':
      return '/';
    case 'href':
      return link.href || null;
    case 'page':
      if (link?.page && typeof link.page === 'string') {
        return `/${link.page}`;
      }
      return null;
    case 'productPage':
      if (link?.productPage && typeof link.productPage === 'string') {
        return `/packages/${link.productPage}`;
      }
      return null;
    default:
      return null;
  }
}
