import {DocumentTextIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Newsletter Block
 */

export const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Newsletter Section',
  description: 'Newsletter signup section',
  icon: DocumentTextIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'klaviyoAccountId',
      title: 'Klaviyo Account ID',
      type: 'string',
    }),
    defineField({
      name: 'klaviyoListId',
      title: 'Klaviyo List ID',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Newsletter Section',
        subtitle: 'Manage your newsletter settings',
      };
    },
  },
});
