import {
  defineArrayMember,
  defineField,
  defineType,
} from 'sanity';

/**
 * Main Menu schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'array',
  of: [
    defineArrayMember({
      name: 'menuItem',
      title: 'Menu Item',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'link',
          title: 'Link',
          type: 'link',
        }),
      ],
    }),
  ],
});
