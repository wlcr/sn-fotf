import {DocumentTextIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

/**
 * Image and Content schema.  Define and edit the fields for the 'imageAndContent' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const imageContentSection = defineType({
  name: 'imageContentSection',
  title: 'Image / Content Section',
  icon: DocumentTextIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image / Photo',
      type: 'mediaImage',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'linkButton',
    }),
    defineField({
      name: 'sectionLayout',
      title: 'Section Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Image Left', value: 'imageLeft'},
          {title: 'Image Right', value: 'imageRight'},
          {title: 'Image Above', value: 'imageAbove'},
        ],
      },
      initialValue: 'imageLeft',
    }),
    defineField({
      name: 'contentAlign',
      title: 'Content Align',
      type: 'string',
      options: {
        list: [
          {title: 'Aligned Left', value: 'alignLeft'},
          {title: 'Aligned Right', value: 'alignRight'},
          {title: 'Center Aligned', value: 'alignCenter'},
        ],
      },
      initialValue: 'alignLeft',
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'content[0].children[0].text', // Assuming the first block has text
      media: 'image',
    },
    prepare({title, media}) {
      const contentText = title ? title : 'No text preview available';
      const trimmedTitle =
        contentText.length > 48
          ? contentText.slice(0, 48) + '...'
          : contentText;
      return {title: trimmedTitle, media};
    },
  },
});
