import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'
import {categoryOptions, mediaFields, providerUrlValidation} from '../shared/catalogue-fields'

export const film = defineType({
  name: 'film',
  title: 'Film',
  type: 'document',
  icon: PlayIcon,
  fields: [
    ...mediaFields,
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (rule) => rule.required().custom((value) => providerUrlValidation('youtube', value)),
    }),
    defineField({
      name: 'category',
      title: 'Instrumentation category (when no related Work)',
      type: 'string',
      options: {list: categoryOptions},
      hidden: ({document}) => Boolean(document?.work),
      description: 'Optional. A related Work supplies its own category.',
    }),
    defineField({
      name: 'actionLabel',
      title: 'Action label on the Work card',
      type: 'string',
      initialValue: 'Watch',
      options: {list: ['Watch', 'Trailer', 'Performance excerpt', 'Insights']},
    }),
  ],
  preview: {
    select: {title: 'title', year: 'year'},
    prepare: ({title, year}) => ({title, subtitle: `YouTube · ${year || 'Undated'}`}),
  },
})
