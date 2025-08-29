import {defineType} from 'sanity';

export const infoSection = defineType({
  name: 'infoSection',
  title: 'Info Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
  ],
});
