import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Image and Content schema.  Define and edit the fields for the 'imageAndContent' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const contentSection = defineType({
  name: 'contentSection',
  title: 'Content Section',
  icon: DocumentTextIcon,
  type: 'object',
  fields: [
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
      name: 'contentAlign',
      title: 'Content Align',
      type: 'string',
      options: {
        list: [
          { title: 'Aligned Left', value: 'alignLeft' },
          { title: 'Aligned Right', value: 'alignRight' },
          { title: 'Center Aligned', value: 'alignCenter' },
        ],
      },
    }),
    defineField({
      name: 'typeSize',
      title: 'Type Size',
      type: 'number',
      options: {
        list: [
          { title: 'Small', value: 2 },
          { title: 'Regular', value: 3 },
          { title: 'Large', value: 5 },
          { title: 'Extra Large', value: 7 },
        ],
      },
      initialValue: 3,
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'content[0].children[0].text', // Assuming the first block has text
    },
    prepare({ title }) {
      const contentText = title
        ? title
        : 'No text preview available';
      const trimmedTitle =
        contentText.length > 48
          ? contentText.slice(0, 48) + '...'
          : contentText;
      return { title: trimmedTitle };
    },
  },
});
