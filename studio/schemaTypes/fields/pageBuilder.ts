import {defineField, defineType} from 'sanity';

export default defineField({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    {type: 'heroSection'},
    {type: 'collectionBlock'},
    {type: 'faqBlock'},
    {type: 'contentBlock'},
    {type: 'imageContentBlock'},
    {type: 'imageBlock'},
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
