import {defineField, defineType} from 'sanity';
import {DocumentIcon} from '@sanity/icons';

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
      description:
        'The SHOPIFY product handle, e.g. sierra-nevada-mustard-squeeze-bottle',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'The slug for this page. Can be the same or different than the product handle.',
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
      name: 'seoControls',
      title: 'SEO Controls',
      type: 'object',
      description:
        'Control search engine discoverability for this specific product',
      fields: [
        defineField({
          name: 'indexable',
          title: 'Allow Search Engine Indexing',
          type: 'boolean',
          description:
            'Allow search engines to index this product page. Uncheck for members-only products.',
          initialValue: true,
        }),
        defineField({
          name: 'followable',
          title: 'Allow Link Following',
          type: 'boolean',
          description:
            'Allow search engines to follow links from this product page.',
          initialValue: true,
        }),
        defineField({
          name: 'customMetaDescription',
          title: 'Custom Meta Description',
          type: 'text',
          description:
            'Override the default product description for search results (max 160 characters)',
          validation: (rule) =>
            rule
              .max(160)
              .warning('Descriptions over 160 characters may be truncated'),
        }),
        defineField({
          name: 'seoNotes',
          title: 'SEO Notes',
          type: 'text',
          description: 'Internal notes about SEO strategy for this product',
        }),
      ],
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        {type: 'collectionBlock'},
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
  preview: {
    select: {
      productHandle: 'productHandle',
      slug: 'slug.current',
    },
    prepare({productHandle, slug}) {
      return {
        title: slug,
        subtitle: 'Shopify product: ' + productHandle,
      };
    },
  },
});
