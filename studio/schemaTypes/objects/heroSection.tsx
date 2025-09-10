import {defineType, defineField} from 'sanity';
import {DocumentIcon} from '@sanity/icons';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Hero Section',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Landscape Vimeo Embed URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare({title}) {
      return {
        title: title || 'Hero Section',
      };
    },
  },
});
