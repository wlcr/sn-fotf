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
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Video title',
    }),
    defineField({
      name: 'mobileVimeoUrl',
      title: 'Mobile Vimeo Embed URL',
      type: 'url',
    }),
    defineField({
      name: 'desktopVimeoUrl',
      title: 'Desktop Vimeo Embed URL',
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
