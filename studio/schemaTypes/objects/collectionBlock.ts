import {defineField, defineType} from 'sanity';
import {PackageIcon} from '@sanity/icons';

/**
 * Collection Block for Page Builder
 *
 * Allows editors to embed a specific Shopify collection within any page.
 * Perfect for showcasing membership products or merchandise on specific pages
 * while controlling where they appear in the page flow.
 */

export const collectionBlock = defineType({
  name: 'collectionBlock',
  title: 'Collection Block',
  type: 'object',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Block Heading',
      type: 'string',
      description: 'Optional heading to display above the collection',
      placeholder: 'e.g., "Featured Memberships" or "Merchandise"',
    }),
    defineField({
      name: 'collectionHandle',
      title: 'Shopify Collection Handle',
      type: 'string',
      description:
        'The handle of the Shopify collection to display (e.g., "memberships" or "merchandise")',
      validation: (Rule) => Rule.required(),
      placeholder: 'e.g., memberships, merchandise, featured-products',
    }),
    defineField({
      name: 'displayOptions',
      title: 'Display Options',
      type: 'object',
      fields: [
        defineField({
          name: 'productsToShow',
          title: 'Number of Products to Show',
          type: 'number',
          description: 'How many products to display (default: 4)',
          initialValue: 4,
          validation: (Rule) => Rule.min(1).max(20),
        }),
        defineField({
          name: 'showDescription',
          title: 'Show Collection Description',
          type: 'boolean',
          description: 'Display the collection description below the heading',
          initialValue: true,
        }),
        defineField({
          name: 'layout',
          title: 'Layout Style',
          type: 'string',
          options: {
            list: [
              {title: 'Grid', value: 'grid'},
              {title: 'Carousel', value: 'carousel'},
              {title: 'List', value: 'list'},
            ],
          },
          initialValue: 'grid',
        }),
        defineField({
          name: 'showViewAllLink',
          title: 'Show "View All" Link',
          type: 'boolean',
          description: 'Display a link to view the full collection page',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'seoControls',
      title: 'SEO Controls',
      type: 'object',
      description: 'Control search engine behavior for this collection block',
      fields: [
        defineField({
          name: 'preventIndexing',
          title: 'Prevent Search Engine Indexing',
          type: 'boolean',
          description:
            'Prevent search engines from indexing pages containing this collection block',
          initialValue: false,
        }),
        defineField({
          name: 'seoNote',
          title: 'SEO Strategy Note',
          type: 'text',
          description: 'Internal notes about SEO strategy for this collection',
          placeholder:
            'e.g., "Members-only products - should not be discoverable by search engines"',
        }),
      ],
    }),
    defineField({
      name: 'styling',
      title: 'Styling Options',
      type: 'object',
      description: 'Visual customization options',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          options: {
            list: [
              {title: 'Default', value: 'default'},
              {title: 'Light Gray', value: 'light-gray'},
              {title: 'Dark', value: 'dark'},
              {title: 'Brand Primary', value: 'brand-primary'},
            ],
          },
          initialValue: 'default',
        }),
        defineField({
          name: 'paddingSize',
          title: 'Padding Size',
          type: 'string',
          options: {
            list: [
              {title: 'Small', value: 'small'},
              {title: 'Medium', value: 'medium'},
              {title: 'Large', value: 'large'},
            ],
          },
          initialValue: 'medium',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      collectionHandle: 'collectionHandle',
      productsToShow: 'displayOptions.productsToShow',
    },
    prepare({heading, collectionHandle, productsToShow}) {
      return {
        title: heading || `Collection: ${collectionHandle}`,
        subtitle: `Shopify collection "${collectionHandle}" - showing ${productsToShow || 4} products`,
        media: PackageIcon,
      };
    },
  },
});
