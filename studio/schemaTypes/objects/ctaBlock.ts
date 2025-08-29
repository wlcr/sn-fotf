import {defineField, defineType} from 'sanity';
import {BulbOutlineIcon} from '@sanity/icons';

/**
 * 2-UP Call to Action
 */

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call to Action Block',
  description: 'A block containing two CTAs side by side',
  icon: BulbOutlineIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{type: 'callToAction'}],
      validation: (Rule) =>
        Rule.max(2).error('You can only have two CTAs in this block'),
    }),
  ],
});
