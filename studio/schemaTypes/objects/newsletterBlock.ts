import {DocumentTextIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Newsletter Block
 */

export const newsletterBlock = defineType({
  name: 'newsletterBlock',
  title: 'Newsletter Block',
  description: 'Newsletter signup block',
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
        title: 'Newsletter Block',
        subtitle: 'Manage your newsletter settings',
      };
    },
  },
});
