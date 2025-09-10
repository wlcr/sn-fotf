import {defineField, defineType} from 'sanity';
import {DocumentIcon} from '@sanity/icons';
import sections from '../fields/sections';

/**
 * Collection Page schema.
 *
 * Allows content editors to create page overrides for specific Shopify collections
 * with custom SEO controls, name overrides, and additional page builder content.
 */

export const collectionPage = defineType({
  name: 'collectionPage',
  title: 'Collection Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'collectionHandle',
      title: 'Collection Handle',
      description:
        'The SHOPIFY collection handle, e.g. beer, merchandise, limited-edition',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'The slug for this page. Can be the same or different than the collection handle.',
      type: 'slug',
      options: {
        source: 'collectionHandle',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameOverride',
      title: 'Name Override',
      type: 'string',
      description: 'An optional override for the collection name.',
    }),
    defineField({
      name: 'descriptionOverride',
      title: 'Description Override',
      type: 'text',
      description: 'An optional override for the collection description.',
    }),
    defineField({
      name: 'seoControls',
      title: 'SEO Controls',
      type: 'object',
      description:
        'Control search engine discoverability for this specific collection',
      fields: [
        defineField({
          name: 'indexable',
          title: 'Allow Search Engine Indexing',
          type: 'boolean',
          description:
            'Allow search engines to index this collection page. Uncheck for members-only collections.',
          initialValue: true,
        }),
        defineField({
          name: 'followable',
          title: 'Allow Link Following',
          type: 'boolean',
          description:
            'Allow search engines to follow links from this collection page.',
          initialValue: true,
        }),
        defineField({
          name: 'customMetaDescription',
          title: 'Custom Meta Description',
          type: 'text',
          description:
            'Override the default collection description for search results (max 160 characters)',
          validation: (rule) =>
            rule
              .max(160)
              .warning('Descriptions over 160 characters may be truncated'),
        }),
        defineField({
          name: 'seoNotes',
          title: 'SEO Notes',
          type: 'text',
          description: 'Internal notes about SEO strategy for this collection',
        }),
      ],
    }),
    defineField({
      name: 'openGraph',
      title: 'Open Graph / Social Media',
      type: 'openGraph',
      description:
        'Custom social media sharing settings for this collection. If not set, defaults will be used.',
    }),
    sections,
  ],
  preview: {
    select: {
      collectionHandle: 'collectionHandle',
      slug: 'slug.current',
    },
    prepare({collectionHandle, slug}) {
      return {
        title: slug,
        subtitle: 'Shopify collection: ' + collectionHandle,
      };
    },
  },
});
