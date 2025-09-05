import {CogIcon} from '@sanity/icons';
import {defineField, defineType, useFormValue} from 'sanity';
import React from 'react';

import {SeoImpactPreview} from '../../components/SeoImpactPreview';

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
      name: 'opengraph',
      title: 'Open Graph / Social Sharing',
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
      title: 'Site Keywords 🎯',
      type: 'array',
      of: [{type: 'string'}],
      description:
        '📝 Internal use only: These help you stay focused on target topics when writing content. Modern search engines ignore meta keywords, but they\'re useful for content strategy and team alignment. Example: "craft beer", "sierra nevada", "exclusive brewing"',
      options: {
        layout: 'tags',
      },
      group: 'seo',
    }),
    // Open Graph / Social Sharing settings (comprehensive)
    defineField({
      name: 'openGraph',
      title: 'Open Graph / Social Sharing Settings',
      type: 'globalOpenGraph',
      description: 'Default social media sharing settings for the entire site',
      group: 'opengraph',
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

    // Global SEO Controls - Redesigned for clarity
    defineField({
      name: 'globalSeoControls',
      title: '🚨 Search Engine Visibility Controls',
      type: 'object',
      description:
        '⚠️ IMPORTANT: These settings control how Google and other search engines can find and index your site. Changes take effect immediately and impact ALL pages.',
      group: 'seo',
      fields: [
        defineField({
          name: 'seoStrategy',
          title: '📋 Current SEO Strategy',
          type: 'string',
          options: {
            list: [
              {
                title: '🎯 RECOMMENDED: Marketing Mode (Tease & Convert)',
                value: 'marketing',
              },
              {
                title:
                  '🔒 Private Mode (Members Find Us Through Other Channels)',
                value: 'private',
              },
              {
                title: '🏠 Homepage Only (Just Landing Page Visible)',
                value: 'homepage_only',
              },
              {
                title: '⚙️ Custom (Advanced - Set Individual Controls Below)',
                value: 'custom',
              },
            ],
            layout: 'radio',
          },
          description:
            'Choose your SEO strategy. This automatically sets the technical controls below. "Marketing Mode" is recommended for member acquisition.',
          initialValue: 'marketing',
        }),
        defineField({
          name: 'impactPreview',
          title: '📊 Impact Preview',
          type: 'object',
          description: 'Real-time preview of what your SEO strategy means',
          fields: [
            {
              name: 'placeholder',
              type: 'string',
              hidden: true,
            },
          ],
          components: {
            input: () => {
              const Component = () => {
                const parentValue = (useFormValue([]) as any) || {};
                const globalSeoControls = parentValue.globalSeoControls || {};

                const strategy = globalSeoControls.seoStrategy || 'marketing';
                const emergencyMode =
                  globalSeoControls.emergencyPrivateMode || false;
                const siteDiscoverable = globalSeoControls.siteDiscoverable;
                const allowRobotsCrawling =
                  globalSeoControls.allowRobotsCrawling;

                return React.createElement(SeoImpactPreview, {
                  strategy,
                  emergencyMode,
                  siteDiscoverable,
                  allowRobotsCrawling,
                });
              };

              return React.createElement(Component);
            },
          },
          hidden: false,
        }),
        defineField({
          name: 'siteDiscoverable',
          title: '🔍 Technical: Site Indexing Control',
          type: 'boolean',
          description:
            '✅ ON = Google can index and show your pages in search results\n❌ OFF = Google will NOT show any pages in search results (complete privacy)\n\n⚠️ IMPACT: Turning OFF removes ALL pages from Google search results within days.',
          initialValue: true,
          hidden: ({parent}) => parent?.seoStrategy !== 'custom',
        }),
        defineField({
          name: 'allowRobotsCrawling',
          title: '🤖 Technical: Search Engine Access Control',
          type: 'boolean',
          description:
            '✅ ON = Google can visit and crawl all public pages\n❌ OFF = Google can only see your homepage, everything else is blocked\n\n⚠️ IMPACT: Turning OFF means only your homepage appears in search results.',
          initialValue: true,
          hidden: ({parent}) => parent?.seoStrategy !== 'custom',
        }),
        defineField({
          name: 'emergencyPrivateMode',
          title: '🚨 EMERGENCY: Hide Site From Search Engines',
          type: 'boolean',
          description:
            '⚠️ EMERGENCY USE ONLY: Immediately hides the entire site from Google and all search engines. Use this if you need to urgently make the site private.\n\n🕐 Takes effect: Immediately\n🕐 Google removal: 1-3 days\n\n❌ This will hurt SEO if used unnecessarily.',
          initialValue: false,
        }),
        defineField({
          name: 'lastModified',
          title: '📅 Last SEO Change',
          type: 'datetime',
          description: 'When these SEO settings were last updated',
          readOnly: true,
          initialValue: new Date().toISOString(),
        }),
        defineField({
          name: 'customRobotsDirectives',
          title: '⚙️ Advanced: Custom Robots Directives',
          type: 'array',
          of: [{type: 'string'}],
          description:
            '🔧 For advanced users only: Additional robots.txt rules. Most users should leave this empty.',
          options: {
            layout: 'tags',
          },
          hidden: ({parent}) => parent?.seoStrategy !== 'custom',
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
