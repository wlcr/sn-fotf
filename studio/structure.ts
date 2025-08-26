import {CogIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['footer', 'header', 'settings', 'homepage']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              S.documentTypeListItems()
                .filter(
                  (listItem: any) =>
                    !DISABLED_TYPES.includes(listItem.getId()) && listItem.getId() === 'page',
                )
                .map((listItem) => listItem.title(pluralize(listItem.getTitle() as string))),
            ),
        ),
      S.listItem()
        .title('Product Decorators')
        .child(
          S.list()
            .title('Product Decorators')
            .items(
              S.documentTypeListItems()
                .filter((listItem: any) => listItem.getSchemaType()?.name === 'productDecorator')
                .map((listItem) => listItem.title(pluralize(listItem.getTitle() as string))),
            ),
        ),
      S.divider(),
      S.listItem()
        .title('Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(S.document().schemaType('settings').documentId('siteSettings'))
                .icon(CogIcon),
              S.listItem()
                .title('Header')
                .child(S.document().schemaType('header').documentId('siteHeader'))
                .icon(CogIcon),
              S.listItem()
                .title('Footer')
                .child(S.document().schemaType('footer').documentId('siteFooter'))
                .icon(CogIcon),
            ]),
        ),
    ])
