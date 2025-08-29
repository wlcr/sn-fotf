import {defineField, defineType} from 'sanity';
import {BulbOutlineIcon} from '@sanity/icons';

/**
 * Call to action schema object.  Objects are reusable schema structures document.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'linkButton',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      description: 'An optional background image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare(selection) {
      const {title} = selection;

      return {
        title,
        subtitle: 'Call to Action',
      };
    },
  },
});
