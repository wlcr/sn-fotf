import {defineField, defineType} from 'sanity';
import {LinkIcon} from '@sanity/icons';

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference, or post reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const mediaImage = defineType({
  name: 'mediaImage',
  title: 'Image / Photo',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description: 'Important for SEO and accessibility.',
      validation: (rule) => {
        // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
        return rule.custom((alt, context) => {
          if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
            return 'Required';
          }
          return true;
        });
      },
    },
  ],
  validation: (rule) => rule.required(),
});
