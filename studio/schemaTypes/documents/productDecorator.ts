import {defineField, defineType} from 'sanity';
import {DocumentIcon} from '@sanity/icons';

/**
 * Product Decorator schema.
 */

export const productDecorator = defineType({
  name: 'productDecorator',
  title: 'Product Decorator',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'productSlug',
      title: 'Product Slug',
      description:
        'The slug in the product page URL: e.g. sierra-nevada-mustard-squeeze-bottle',
      type: 'slug',
    }),
    defineField({
      name: 'nameOverride',
      title: 'Name Override',
      type: 'string',
      description: 'An optional override for the product name.',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        {type: 'faqBlock'},
        {type: 'contentBlock'},
        {type: 'imageContentBlock'},
        {type: 'imageBlock'},
      ],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
});
