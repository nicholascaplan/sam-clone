import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {categoryField, sourceKeyField, titleField} from '../shared/catalogue-fields'
import {noEmDash} from '../shared/validation'

export const work = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    titleField,
    defineField({
      name: 'year',
      title: 'Composition year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1000).max(9999),
    }),
    categoryField,
    defineField({
      name: 'instrumentation',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().custom(noEmDash),
    }),
    defineField({
      name: 'duration',
      title: 'Composition duration',
      type: 'string',
      description: 'For example 8 mins. Leave blank if unknown.',
      validation: (rule) => rule.custom(noEmDash),
    }),
    ...['commission', 'premiere', 'notes'].map((name) =>
      defineField({name, type: 'text', rows: 2, validation: (rule) => rule.custom(noEmDash)}),
    ),
    sourceKeyField,
  ],
  orderings: [{
    title: 'Newest first',
    name: 'newest',
    by: [{field: 'year', direction: 'desc'}, {field: 'title', direction: 'asc'}],
  }],
  preview: {
    select: {title: 'title', year: 'year', instrumentation: 'instrumentation'},
    prepare: ({title, year, instrumentation}) => ({title, subtitle: `${year} · ${instrumentation}`}),
  },
})
