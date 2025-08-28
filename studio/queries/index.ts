import groq from 'groq';
import {linkFields, pageBuilder} from './fragments';

export const settingsQuery = groq`*[_type == "settings"][0]`;

export const headerQuery = groq`
  *[_type == "header"][0] {
    ...,
    mainMenu[]{
      ...,
      ${linkFields}
    },
    announcementBar{
      ...,
      ${linkFields}
    }
  }
`;

export const footerQuery = groq`
  *[_type == "footer"][0] {
    ...,
    footerMenu[]{
      ...,
      ${linkFields}
    }
  }
`;

export const productDecoratorQuery = groq`
  *[_type == "productDecorator" && productSlug.current == $handle][0]{
    nameOverride,
    ${pageBuilder}
  }`;

export const homeQuery = groq`
  *[_type == 'homepage'][0]{
    _id,
    _type,
    name,
    heroVideo,
    ${pageBuilder}
  }
`;

export const productPageQuery = groq`
  *[_type == "productPage" && slug.current == $handle][0]{
    ...,
    ${pageBuilder}
  }`;

export const getPageQuery = groq`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    ${pageBuilder}
  }
`;

export const sitemapData = groq`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`;

export const pagesSlugs = groq`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`;
