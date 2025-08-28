import {DocumentTextIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Special Component Section
 */

export const specialComponentSection = defineType({
  name: 'specialComponentSection',
  title: 'Special Component Section',
  description: 'Special component section // pick a code-based section',
  icon: DocumentTextIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'specialComponent',
      title: 'Special Component',
      type: 'string',
      options: {
        list: [
          {title: 'Labels Component', value: 'labelsComponent'},
          {title: 'Map Component', value: 'mapComponent'},
          {title: 'Dummy Component', value: 'dummyComponent'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'specialComponent',
      subtitle: 'sectionId',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Special Component Section',
        subtitle: subtitle || '',
      };
    },
  },
});
