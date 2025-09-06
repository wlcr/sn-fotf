/**
 * Sanity Types for App Usage
 *
 * This file re-exports only the types needed by the app components,
 * without importing the full studio configuration that would pull in
 * heavy dependencies during server startup.
 */

// Re-export base Sanity types that don't conflict with generated types
export type {
  SanityDocument,
  Reference as SanityReference,
  Asset as SanityAsset,
  File as SanityFile,
} from '@sanity/types';

// Import the generated types separately to avoid studio config dependencies
// TEMPORARILY COMMENTED OUT TO TEST SERVER-SIDE IMPORT ISSUE
// export * from '../../studio/sanity.types';
