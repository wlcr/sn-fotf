import {defineField, defineType} from 'sanity';

export const pageSection = defineType({
  name: 'pageSection',
  title: 'Page Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionBuilder',
      title: 'Section Builder',
      description: 'Content blocks for this section',
      type: 'array',
      of: [
        {type: 'contentBlock'},
        {type: 'imageContentBlock'},
        {type: 'imageBlock'},
        {type: 'ctaBlock'},
        {type: 'newsletterBlock'},
        {type: 'specialComponentBlock'},
      ],
    }),
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    }),
    defineField({
      name: 'sectionClasses',
      title: 'Section Classes',
      type: 'string',
    }),
  ],
});
