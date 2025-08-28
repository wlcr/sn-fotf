import {defineField, defineType} from 'sanity';

export const pageSections = defineType({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'pageSection',
      title: 'Page Section',
      fields: [
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
        defineField({
          name: 'sectionBuilder',
          title: 'Section Builder',
          type: 'array',
          of: [
            // ...put your pageBuilder block types here, e.g.:
            {type: 'contentSection'},
            {type: 'imageContentSection'},
            {type: 'imageSection'},
            {type: 'sideBySideCta'},
            {type: 'newsletterSection'},
            {type: 'specialComponentSection'},
          ],
        }),
      ],
    },
  ],
});
