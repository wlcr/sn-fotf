import {CogIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Site Settings schema - Global configuration for SEO, analytics, branding, and company info.
 *
 * IMPORTANT: Legal/Policy Strategy Decision Needed
 * The current implementation uses Shopify's built-in policies (privacy, terms, shipping, refund)
 * which are shared with sierranevada.com. This may not be appropriate for the Friends of the Family
 * site as it has different legal requirements. We need to confirm with the client whether:
 *
 * 1. Use Shopify policies (shared with main site) - simpler but may not fit
 * 2. Create custom Sanity policy singletons - more control but requires legal review
 * 3. Hybrid approach - Shopify for e-commerce, Sanity for brand-specific policies
 *
 * Current implementation supports option 3 with ability to migrate to option 2 if needed.
 */

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'seo',
      title: 'SEO & Metadata',
    },
    {
      name: 'analytics',
      title: 'Analytics & Tracking',
    },
    {
      name: 'company',
      title: 'Company Info',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'legal',
      title: 'Legal & Compliance',
    },
  ],
  fields: [
    // SEO & Metadata Group
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description:
        'The title of your site, displayed in browser tabs and search results',
      initialValue: 'Sierra Nevada Friends of the Family',
      validation: (rule) =>
        rule
          .required()
          .max(60)
          .warning(
            'Titles over 60 characters may be truncated in search results',
          ),
      group: 'seo',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description:
        'A brief description of your site for search engines and social media',
      initialValue:
        'Sierra Nevada Brewing Company - Friends of the Family program',
      validation: (rule) =>
        rule
          .max(160)
          .warning(
            'Descriptions over 160 characters may be truncated in search results',
          ),
      group: 'seo',
    }),
    defineField({
      name: 'keywords',
      title: 'Site Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Keywords that describe your site (optional, for internal use)',
      options: {
        layout: 'tags',
      },
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Social Share Image',
      type: 'image',
      description:
        'Default image for social media sharing and search results (1200x630px recommended)',
      group: 'seo',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Alternative text is required when an image is selected';
              }
              return true;
            });
          },
        }),
      ],
    }),

    // Analytics & Tracking Group
    defineField({
      name: 'gtmContainerId',
      title: 'Google Tag Manager Container ID',
      type: 'string',
      description:
        'GTM Container ID (e.g., GTM-XXXXXXX) for tracking and analytics',
      placeholder: 'GTM-XXXXXXX',
      validation: (rule) =>
        rule.custom((value) => {
          if (value && !value.match(/^GTM-[A-Z0-9]+$/)) {
            return 'Must be in format GTM-XXXXXXX';
          }
          return true;
        }),
      group: 'analytics',
    }),
    defineField({
      name: 'ga4MeasurementId',
      title: 'Google Analytics 4 Measurement ID',
      type: 'string',
      description: 'GA4 Measurement ID (e.g., G-XXXXXXXXXX) as backup to GTM',
      placeholder: 'G-XXXXXXXXXX',
      validation: (rule) =>
        rule.custom((value) => {
          if (value && !value.match(/^G-[A-Z0-9]+$/)) {
            return 'Must be in format G-XXXXXXXXXX';
          }
          return true;
        }),
      group: 'analytics',
    }),
    defineField({
      name: 'facebookPixelId',
      title: 'Facebook Pixel ID',
      type: 'string',
      description: 'Facebook Pixel ID for social media advertising tracking',
      placeholder: '1234567890123456',
      group: 'analytics',
    }),

    // Company Info Group
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'Official company name',
      initialValue: 'Sierra Nevada Brewing Co.',
      validation: (rule) => rule.required(),
      group: 'company',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'General contact email address',
      validation: (rule) => rule.email(),
      group: 'company',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      description: 'Customer service phone number',
      group: 'company',
    }),
    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'text',
      description: 'Physical address for contact info and schema markup',
      rows: 3,
      group: 'company',
    }),

    // Social Media Group
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Full URL to Instagram profile',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Full URL to Facebook page',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'url',
          description: 'Full URL to Twitter/X profile',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          description: 'Full URL to YouTube channel',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          description: 'Full URL to LinkedIn company page',
        }),
      ],
    }),

    // Legal & Compliance Group
    // NOTE: See schema comment about policy strategy decision needed
    defineField({
      name: 'cookieConsentMessage',
      title: 'Cookie Consent Message',
      type: 'text',
      description: 'Custom message for cookie consent banner (if implemented)',
      initialValue:
        'We use cookies to enhance your browsing experience and analyze our traffic.',
      group: 'legal',
    }),
    defineField({
      name: 'showCookieConsent',
      title: 'Show Cookie Consent Banner',
      type: 'boolean',
      description: 'Toggle cookie consent banner display',
      initialValue: true,
      group: 'legal',
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
