import {defineType} from 'sanity';

export const productDecorator = defineType({
  name: 'productDecorator',
  title: 'Product Decorator',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
  ],
});
