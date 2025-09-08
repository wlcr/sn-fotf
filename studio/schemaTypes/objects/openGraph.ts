import {defineField, defineType} from 'sanity';
import {ShareIcon} from '@sanity/icons';

/**
 * Open Graph object for social media sharing control
 *
 * This provides content editors with full control over how pages appear
 * when shared on social media platforms like Facebook, Twitter, LinkedIn.
 */
export const openGraph = defineType({
  name: 'openGraph',
  title: 'Open Graph / Social Media',
  type: 'object',
  icon: ShareIcon,
  description: 'Control how this content appears when shared on social media',
  fields: [
    defineField({
      name: 'title',
      title: 'Social Media Title',
      type: 'string',
      description:
        'Title for social media sharing (Facebook, Twitter, etc.). If not set, the page title will be used.',
      validation: (rule) =>
        rule
          .max(60)
          .warning(
            'Titles longer than 60 characters may be truncated on social media',
          ),
    }),
    defineField({
      name: 'description',
      title: 'Social Media Description',
      type: 'text',
      rows: 3,
      description:
        'Description for social media sharing. If not set, the page meta description will be used.',
      validation: (rule) =>
        rule
          .max(160)
          .warning('Descriptions longer than 160 characters may be truncated'),
    }),
    defineField({
      name: 'image',
      title: 'Social Media Image',
      type: 'image',
      description:
        'Image for social media sharing. Recommended: 1200×630px for best results across platforms.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
          validation: (rule) =>
            rule
              .required()
              .error('Alt text is required for social media images'),
        }),
      ],
      validation: (rule) =>
        rule.custom((image, context) => {
          // If an image is provided, alt text is required
          if (image && !image.alt) {
            return 'Alt text is required when an image is provided';
          }
          return true;
        }),
    }),
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          {title: 'Website', value: 'website'},
          {title: 'Article', value: 'article'},
          {title: 'Product', value: 'product'},
        ],
      },
      initialValue: 'website',
      description:
        'The type of content for Open Graph. Usually "website" for most pages.',
    }),
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      options: {
        list: [
          {title: 'Summary (default)', value: 'summary'},
          {title: 'Summary Large Image', value: 'summary_large_image'},
          {title: 'App', value: 'app'},
          {title: 'Player', value: 'player'},
        ],
      },
      initialValue: 'summary_large_image',
      description:
        'Twitter card type. "Summary Large Image" is recommended for most content.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Social Media',
      type: 'boolean',
      description:
        'If enabled, this content will include meta tags to discourage social media crawlers.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      media: 'image',
      type: 'type',
    },
    prepare({title, description, media, type}) {
      return {
        title: title || 'Open Graph Settings',
        subtitle: `${type || 'website'} • ${description ? description.slice(0, 50) + '...' : 'No description'}`,
        media,
      };
    },
  },
});

/**
 * Simplified Open Graph object for global settings
 *
 * Used in the global settings to provide site-wide defaults
 */
export const globalOpenGraph = defineType({
  name: 'globalOpenGraph',
  title: 'Default Open Graph Settings',
  type: 'object',
  icon: ShareIcon,
  description:
    "Default social media settings used when pages don't have their own Open Graph settings",
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'The name of your site as it appears on social media',
      placeholder: 'Sierra Nevada Friends of the Family',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'defaultImage',
      title: 'Default Social Media Image',
      type: 'image',
      description:
        "Default image used when pages don't have their own social media image. Recommended: 1200×630px.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alt text for the default social media image',
          placeholder: 'Sierra Nevada Friends of the Family',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
      description:
        'Your Twitter handle (without @) for Twitter Card attribution',
      placeholder: 'sierranevada',
      validation: (rule) =>
        rule
          .regex(/^[A-Za-z0-9_]+$/, {
            name: 'twitter handle',
            invert: false,
          })
          .warning('Should only contain letters, numbers, and underscores'),
    }),
    defineField({
      name: 'facebookAppId',
      title: 'Facebook App ID',
      type: 'string',
      description:
        'Facebook App ID for enhanced social media integration (optional)',
    }),
  ],
  preview: {
    select: {
      siteName: 'siteName',
      twitterHandle: 'twitterHandle',
      media: 'defaultImage',
    },
    prepare({siteName, twitterHandle, media}) {
      return {
        title: 'Global Open Graph Settings',
        subtitle: `${siteName || 'No site name'} • @${twitterHandle || 'no twitter'}`,
        media,
      };
    },
  },
});
