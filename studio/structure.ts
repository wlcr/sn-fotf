import {CogIcon, DocumentIcon, HomeIcon} from '@sanity/icons';
import type {StructureResolver} from 'sanity/structure';

// Define the structure for Sanity Studio
// This configuration controls how documents appear in the Studio navigation
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singletons - These appear as single edit pages, not lists
      // Users cannot create multiple instances of these
      S.listItem()
        .title('Settings')
        .id('settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('settings')
            .documentId('settings')
            .title('Site Settings'),
        ),

      S.listItem()
        .title('Header')
        .id('header')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('header')
            .documentId('header')
            .title('Header Configuration'),
        ),

      S.listItem()
        .title('Footer')
        .id('footer')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('footer')
            .documentId('footer')
            .title('Footer Configuration'),
        ),

      S.listItem()
        .title('Homepage')
        .id('homepage')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage Content'),
        ),

      // Divider
      S.divider(),

      // Regular document types that can have multiple instances
      S.listItem()
        .title('Pages')
        .id('pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),

      S.listItem()
        .title('Product Pages')
        .id('productPages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('productPage').title('Product Pages')),

      // Filter out singleton types from the regular document lists
      // This prevents users from seeing them in auto-generated lists
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['settings', 'header', 'footer', 'homepage'].includes(
            listItem.getId()!,
          ),
      ),
    ]);
