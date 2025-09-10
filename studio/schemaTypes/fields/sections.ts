import {defineField, defineType} from 'sanity';

export default defineField({
  name: 'sections',
  title: 'Sections',
  type: 'array',
  of: [
    {type: 'heroSection'},
    {type: 'collectionSection'},
    {type: 'faqSection'},
    {type: 'contentSection'},
    {type: 'imageContentSection'},
    {type: 'imageSection'},
  ],
  options: {
    insertMenu: {
      // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
      views: [
        {
          name: 'grid',
          previewImageUrl: (schemaTypeName) =>
            `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
        },
      ],
    },
  },
});
