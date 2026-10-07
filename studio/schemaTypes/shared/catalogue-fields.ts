import {defineField} from 'sanity'
import {noEmDash} from './validation'
import {parseMediaUrl} from '../../../scripts/lib/media-url.mjs'

export const categoryOptions = [
  {title: 'Solo & Chamber', value: 'chamber'},
  {title: 'Large Ensemble', value: 'ensemble'},
  {title: 'Vocal & Choral', value: 'vocal'},
  {title: 'Opera & Stage', value: 'opera'},
  {title: 'Orchestral', value: 'orchestral'},
]

export const titleField = defineField({
  name: 'title', type: 'string', validation: (rule) => rule.required().custom(noEmDash),
})
export const sourceKeyField = defineField({
  name: 'sourceKey', title: 'Import source key', type: 'string', hidden: true, readOnly: true,
})
export const categoryField = defineField({
  name: 'category', type: 'string', options: {list: categoryOptions},
  validation: (rule) => rule.required(),
})
export const mediaFields = [
  titleField,
  defineField({
    name: 'work', title: 'Related Work', type: 'reference', to: [{type: 'work'}],
    description: 'Optional. Links this media to a composition, even if their titles differ.',
  }),
  defineField({
    name: 'year', title: 'Recording / publication year', type: 'number',
    description: 'Leave blank when unknown. This is separate from the composition year.',
    validation: (rule) => rule.integer().min(1000).max(9999),
  }),
  defineField({
    name: 'duration', title: 'Recording duration', type: 'string',
    description: 'Optional, in minutes:seconds (for example 8:08). Not the composition duration or Spotify preview length.',
    validation: (rule) => rule.regex(/^\d+:[0-5]\d$/, {name: 'minutes:seconds'}),
  }),
  defineField({
    name: 'detail', title: 'Description / performers', type: 'text', rows: 3,
    validation: (rule) => rule.required().custom(noEmDash),
  }),
  defineField({
    name: 'actionOrder', title: 'Media-action order within the Work', type: 'number', initialValue: 0,
    description: 'Lower numbers appear first (0, 1, 2...). Shared across recordings and films. Does not change newest-first catalogue ordering.',
    validation: (rule) => rule.required().integer().min(0),
  }),
  sourceKeyField,
]

export const providerUrlValidation = (provider: string | undefined, value: string | undefined) => {
  if (!value) return true // required() reports the missing URL
  if (!provider) return 'Choose a provider first.'
  try { parseMediaUrl(provider, value); return true } catch (error) {
    return error instanceof Error ? error.message : 'Invalid provider URL.'
  }
}
