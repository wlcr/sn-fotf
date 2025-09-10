import {DocumentTextIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Image and Content schema.  Define and edit the fields for the 'imageAndContent' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const imageSection = defineType({
  name: 'imageSection',
  title: 'Image Section',
  icon: DocumentTextIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image / Photo',
      type: 'mediaImage',
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      media: 'image',
    },
    prepare({media}) {
      return {media};
    },
  },
});
