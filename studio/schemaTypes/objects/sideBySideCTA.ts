import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

/**
 * 2-UP Call to Action
 */

export const sideBySideCta = defineType({
  name: 'sideBySideCta',
  title: 'Side by Side - CTA',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'sideA',
      title: 'Side A',
      type: 'callToAction',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sideB',
      title: 'Side B',
      type: 'callToAction',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      sideA: 'sideA.heading',
      sideB: 'sideB.heading',
    },
    prepare(selection) {
      const {sideA, sideB} = selection

      return {
        title: sideA,
        subtitle: sideB,
      }
    },
  },
})
