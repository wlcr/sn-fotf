import {CogIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Footer schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const footer = defineType({
  name: 'footer',
  title: 'Footer Configuration',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Footer Logo',
      type: 'image',
      description:
        'Logo displayed in the footer (different style than header logo)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description:
            'Alternative text for the footer logo (important for accessibility)',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'internalLinks',
      title: 'Internal Links Menu',
      type: 'menu',
      description: 'Navigation links for internal pages (Products, FAQ, etc.)',
    }),
    defineField({
      name: 'externalLinks',
      title: 'External Links Menu',
      type: 'menu',
      description: 'External links for SierraNevada.com pages etc.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
      };
    },
  },
});
