import {CogIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Cookie Policy schema - Singleton for managing cookie and privacy policies
 * specific to the Friends of the Family site.
 *
 * NOTE: Currently not active - see settings.tsx comment about policy strategy.
 * This schema is prepared in case we need custom policies separate from Shopify.
 */

export const cookiePolicy = defineType({
  name: 'cookiePolicy',
  title: 'Cookie Policy',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Policy Title',
      type: 'string',
      initialValue: 'Cookie Policy',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description: 'Date this policy was last updated',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
      description: 'Date this policy takes effect',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Policy Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lastUpdated: 'lastUpdated',
    },
    prepare({title, lastUpdated}) {
      return {
        title: title || 'Cookie Policy',
        subtitle: lastUpdated
          ? `Updated: ${new Date(lastUpdated).toLocaleDateString()}`
          : 'No update date set',
      };
    },
  },
});
