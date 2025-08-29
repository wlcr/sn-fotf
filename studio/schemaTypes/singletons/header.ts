import {CogIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Header schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'mainMenu',
      title: 'Main Menu',
      type: 'menu',
    }),
    defineField({
      name: 'showAddress',
      description: 'Show the address in the header?',
      title: 'Show Address',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showPhone',
      description: 'Show the phone number in the header?',
      title: 'Show Phone',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'announcementBar',
      description: 'Announcement Bar content',
      title: 'Announcement Bar',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Text',
          type: 'string',
        }),
        defineField({
          name: 'link',
          title: 'Link',
          type: 'link',
        }),
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: false,
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
