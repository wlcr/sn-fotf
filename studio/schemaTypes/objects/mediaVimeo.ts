import {defineField, defineType} from 'sanity';

export const mediaVimeo = defineType({
  name: 'mediaVimeo',
  title: 'Media: Vimeo',
  type: 'object',
  groups: [
    {
      name: 'landscape',
      title: 'Landscape',
    },
    {
      name: 'portrait',
      title: 'Portrait',
    },
  ],
  fields: [
    defineField({
      name: 'landscapeVimeoEmbed',
      title: 'Landscape Vimeo Embed URL',
      type: 'url',
      group: 'landscape',
    }),
    defineField({
      name: 'landscapePoster',
      title: 'Landscape Poster',
      type: 'image',
      group: 'landscape',
    }),
    defineField({
      name: 'portraitVimeoEmbed',
      title: 'Portrait Vimeo Embed URL',
      type: 'url',
      group: 'portrait',
    }),
    defineField({
      name: 'portraitPoster',
      title: 'Portrait Poster',
      type: 'image',
      group: 'portrait',
    }),
    defineField({
      name: 'vimeoDescription',
      title: 'Video Description',
      description: 'Not sure what this is supposed to be',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'vimeoDescription',
      subtitle: 'videoId',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Vimeo Item',
        subtitle: subtitle || '',
      };
    },
  },
});
