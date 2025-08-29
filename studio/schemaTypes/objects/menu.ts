import {defineType} from 'sanity';

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
  ],
});
