import groq from 'groq';
import {pageBuilder} from './fragments';

export const HOME_QUERY = groq`
  *[_type == 'homepage'][0]{
    ...,
    pageBuilder[]{
      ...,
      sectionBuilder[]${pageBuilder}
    }
  }
`;

export const PRODUCT_PAGE_QUERY = groq`
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

export const COLLECTION_PAGE_QUERY = groq`
  *[_type == "collectionPage" && slug.current == $handle][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    collectionHandle,
    slug,
    nameOverride,
    descriptionOverride,
    seoControls {
      indexable,
      followable,
      customMetaDescription,
      seoNotes
    },
    pageBuilder[]${pageBuilder}
  }`;

export const PAGE_QUERY = groq`
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

export const SITEMAP_DATA_QUERY = groq`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`;

export const PAGES_SLUGS_QUERY = groq`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`;
