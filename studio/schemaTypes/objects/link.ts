import {defineField, defineType} from 'sanity';
import {LinkIcon} from '@sanity/icons';

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference, or post reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'home',
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Product Page', value: 'productPage'},
          {title: 'Page', value: 'page'},
          {title: 'URL', value: 'href'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'href',
      validation: (Rule) =>
        // Custom validation to ensure URL is provided if the link type is 'href'
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
        // Custom validation to ensure page reference is provided if the link type is 'page'
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
        // Custom validation to ensure page reference is provided if the link type is 'page'
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'productPage' && !value) {
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
  preview: {
    select: {
      productPage: 'productPage.slug.current',
      page: 'page.slug.current',
      href: 'href',
      type: 'linkType',
    },
    prepare({type, productPage, page, href}) {
      switch (type) {
        case 'home':
          return {
            title: 'Home',
          };
        case 'productPage':
          return {
            title: productPage || 'Product Page',
          };
        case 'page':
          return {
            title: page || 'Internal Page',
          };
        default:
          return {
            title: href || 'External Link',
          };
      }
    },
  },
});
