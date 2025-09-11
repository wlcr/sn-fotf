import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'announcementBar',
  title: 'Announcement Bar',
  type: 'document',
  icon: () => '📢',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show Announcement Bar',
      type: 'boolean',
      description: 'Toggle to show or hide the announcement bar',
      initialValue: false,
    }),
    defineField({
      name: 'content',
      title: 'Announcement Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'linkType',
                    title: 'Link Type',
                    type: 'string',
                    initialValue: 'href',
                    options: {
                      list: [
                        {title: 'URL', value: 'href'},
                        {title: 'Page', value: 'page'},
                        {title: 'Product Page', value: 'productPage'},
                      ],
                      layout: 'radio',
                    },
                  }),
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    hidden: ({parent}) =>
                      parent?.linkType !== 'href' && parent?.linkType != null,
                    validation: (Rule) =>
                      Rule.custom((value, context: any) => {
                        if (context.parent?.linkType === 'href' && !value) {
                          return 'URL is required when Link Type is URL';
                        }
                        return true;
                      }),
                  }),
                  defineField({
                    name: 'page',
                    title: 'Page',
                    type: 'reference',
                    to: [{type: 'page'}],
                    hidden: ({parent}) => parent?.linkType !== 'page',
                    validation: (Rule) =>
                      Rule.custom((value, context: any) => {
                        if (context.parent?.linkType === 'page' && !value) {
                          return 'Page reference is required when Link Type is Page';
                        }
                        return true;
                      }),
                  }),
                  defineField({
                    name: 'productPage',
                    title: 'Product Page',
                    type: 'reference',
                    to: [{type: 'productPage'}],
                    hidden: ({parent}) => parent?.linkType !== 'productPage',
                    validation: (Rule) =>
                      Rule.custom((value, context: any) => {
                        if (
                          context.parent?.linkType === 'productPage' &&
                          !value
                        ) {
                          return 'Product Page reference is required when Link Type is Product Page';
                        }
                        return true;
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        },
      ],
      description:
        'Rich text content for the announcement. Supports line breaks and inline links.',
    }),
    defineField({
      name: 'wrapperLink',
      title: 'Wrapper Link (Optional)',
      type: 'link',
      description:
        'Optional link to make the entire announcement bar clickable. Leave empty if you only want inline links.',
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      content: 'content',
    },
    prepare({enabled, content}) {
      const status = enabled ? 'Enabled' : 'Disabled';
      const preview = content?.[0]?.children?.[0]?.text || 'No content';
      return {
        title: `Announcement Bar (${status})`,
        subtitle: preview,
      };
    },
  },
});
