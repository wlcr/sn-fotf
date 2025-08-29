import {DocumentTextIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Special Component Block
 */

export const specialComponentBlock = defineType({
  name: 'specialComponentBlock',
  title: 'Special Component Block',
  description: 'Special component block // pick a code-based component block',
  icon: DocumentTextIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'specialComponent',
      title: 'Special Component',
      type: 'string',
      options: {
        list: [
          {title: 'Beer Labels Component', value: 'labelsComponent'},
          {title: 'Beer Map Component', value: 'mapComponent'},
          {title: 'Dummy Component', value: 'dummyComponent'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'specialComponent',
    },
    prepare({title}) {
      console.log('title', title);
      return {
        title: title || 'Special Component Block',
      };
    },
  },
});
