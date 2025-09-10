import groq from 'groq';
import {sectionsFragment} from './fragments';

export const HOME_QUERY = groq`
  *[_type == 'homepage'][0]{
    ...,
    sections[]${sectionsFragment}
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
    sections[]${sectionsFragment}
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
    sections[]${sectionsFragment}
  }`;

export const PAGE_QUERY = groq`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    sections[]${sectionsFragment}
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
