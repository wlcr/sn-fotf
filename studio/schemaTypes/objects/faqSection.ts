import {defineField, defineType} from 'sanity';
import {HelpCircleIcon} from '@sanity/icons';

export default defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'FAQ Section Title',
      description: 'The title of the FAQ section, as an H2',
      type: 'string',
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          title: 'FAQ',
          name: 'faqItem',
          type: 'object',
          icon: HelpCircleIcon,
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
            },
            {
              name: 'hidden',
              title: 'Hidden',
              description: 'Hide this FAQ Item',
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: 'FAQ Section',
        subtitle: title,
      };
    },
  },
});
