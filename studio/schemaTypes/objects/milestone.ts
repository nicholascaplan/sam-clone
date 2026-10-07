import {defineField, defineType} from 'sanity'
import {noEmDash} from '../shared/validation'

export const milestone = defineType({
  name: 'milestone',
  title: 'Milestone',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (rule) =>
        rule.required().regex(/^\d{4}$/, {name: 'year', invert: false}).error('Use a four-digit year'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().custom(noEmDash),
    }),
    defineField({
      name: 'detail',
      title: 'Detail',
      type: 'string',
      description: 'Short caption, for example the commissioner or venue.',
      validation: (rule) => rule.required().custom(noEmDash),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'year', description: 'detail'},
  },
})
