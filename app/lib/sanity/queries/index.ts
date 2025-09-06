/**
 * Sanity Queries Index
 *
 * Re-exports all Sanity GROQ queries for easy importing throughout the application.
 * All queries are isolated from studio dependencies to avoid server-side sanity imports.
 */

// Header queries
export {HEADER_QUERY} from './header';

// Footer queries
export {FOOTER_QUERY} from './footer';

// Settings queries
export {SETTINGS_QUERY} from './settings';

// Page queries
export {
  HOME_QUERY,
  PRODUCT_PAGE_QUERY,
  COLLECTION_PAGE_QUERY,
  PAGE_QUERY,
  SITEMAP_DATA_QUERY,
  PAGES_SLUGS_QUERY,
} from './pages';
