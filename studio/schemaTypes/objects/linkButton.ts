import {defineField, defineType} from 'sanity';
import {BulbOutlineIcon} from '@sanity/icons';

/**
 * Call to action schema object.  Objects are reusable schema structures document.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const linkButton = defineType({
  name: 'linkButton',
  title: 'Link Button',
  type: 'object',
  icon: BulbOutlineIcon,
  validation: (Rule) =>
    // This is a custom validation rule that requires both 'buttonText' and 'link' to be set, or neither to be set
    Rule.custom((fields) => {
      const {buttonText, link} = fields || {};
      if (
        (buttonText && buttonText !== '' && link) ||
        !buttonText ||
        (buttonText === '' && !link)
      ) {
        return true;
      }
      return 'Both Button text and Button link must be set, or both must be empty';
    }),
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button text',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Button link',
      type: 'link',
    }),
  ],
  preview: {
    select: {
      title: 'buttonText',
    },
    prepare(selection) {
      const {title} = selection;

      return {
        title,
        subtitle: 'Link Button',
      };
    },
  },
});
