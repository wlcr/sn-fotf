import {CogIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Footer schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'footerMenu',
      title: 'Footer Menu',
      type: 'menu',
    }),
    defineField({
      name: 'privacyLink',
      description:
        'Link to the privacy policy: https://www.squadup.com/privacy',
      title: 'Privacy Policy Link',
      type: 'link',
    }),
    defineField({
      name: 'termsLink',
      description: 'Link to the terms of service: https://www.squadup.com/tos',
      title: 'Terms of Service Link',
      type: 'link',
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
