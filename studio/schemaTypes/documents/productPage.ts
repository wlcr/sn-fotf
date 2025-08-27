import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Product Decorator schema.
 */

export const productPage = defineType({
  name: 'productPage',
  title: 'Product Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'productHandle',
      title: 'Product Handle',
      description: 'The SHOPIFY product handle, e.g. sierra-nevada-mustard-squeeze-bottle',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'The slug for this page. Can be the same or different than the product handle.',
      type: 'slug',
      options: {
        source: 'productHandle',
      },
      validation: (Rule) => Rule.required(),
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
        {type: 'faqSection'},
        {type: 'contentSection'},
        {type: 'imageContentSection'},
        {type: 'imageSection'},
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
})
