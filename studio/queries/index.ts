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

export const homeQuery = groq`
  *[_type == 'homepage'][0]{
    ...,
    pageBuilder[]{
      ...,
      sectionBuilder[]${pageBuilder}
    }
  }
`;

export const productPageQuery = groq`
  *[_type == "productPage" && slug.current == $handle][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    productHandle,
    slug,
    nameOverride,
    seoControls {
      indexable,
      followable,
      customMetaDescription,
      seoNotes
    },
    pageBuilder[]${pageBuilder}
  }`;

export const getPageQuery = groq`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    pageBuilder[]${pageBuilder}
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
