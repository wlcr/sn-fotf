import { CogIcon } from '@sanity/icons';
import {
  defineArrayMember,
  defineField,
  defineType,
} from 'sanity';

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'venueName',
      title: 'Venue Name',
      type: 'string',
      description: 'The name of the venue for this site',
      initialValue: 'Make Some Noise',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Venue Address',
      type: 'string',
      description: 'The physical address of this venue',
    }),
    defineField({
      name: 'phone',
      title: 'Venue Phone',
      type: 'string',
      description:
        'The contact phone number for this venue',
    }),
    defineField({
      name: 'email',
      title: 'Venue Email',
      type: 'string',
      description:
        'The contact email address for this venue',
    }),
    defineField({
      name: 'googleMapLink',
      title: 'Google Map Link',
      type: 'url',
      description: 'The Google Maps link for this venue',
    }),
    defineField({
      name: 'title',
      description:
        'This is the title of your site, displayed in the browser tab and search results.',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Make Some Noise',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description:
        'This is the description for the site, displayed in search results.',
      title: 'Site Description',
      type: 'string',
      initialValue: 'Make Some Noise concerts and events',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          description:
            'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if (
                (context.document?.ogImage as any)?.asset
                  ?._ref &&
                !alt
              ) {
                return 'Required';
              }
              return true;
            });
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      };
    },
  },
});
