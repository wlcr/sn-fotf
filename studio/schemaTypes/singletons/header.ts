import {CogIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Header schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const header = defineType({
  name: 'header',
  title: 'Header Configuration',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'mainMenu',
      title: 'Main Menu',
      type: 'menu',
      description: 'Main navigation menu items displayed in the header',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Site logo displayed in the header',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description:
            'Alternative text for the logo (important for accessibility)',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      description: 'Call-to-action button in the header',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          placeholder: 'e.g., "Shop Now", "Join Now"',
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'link',
        }),
        defineField({
          name: 'enabled',
          title: 'Show Button',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Header',
      };
    },
  },
});
