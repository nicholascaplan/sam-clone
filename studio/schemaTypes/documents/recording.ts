import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'
import {mediaFields, providerUrlValidation} from '../shared/catalogue-fields'
import {noEmDash} from '../shared/validation'

export const recording = defineType({
  name: 'recording',
  title: 'Recording',
  type: 'document',
  icon: PlayIcon,
  fields: [
    ...mediaFields,
    defineField({
      name: 'provider',
      type: 'string',
      options: {
        list: [{title: 'SoundCloud', value: 'soundcloud'}, {title: 'Spotify', value: 'spotify'}],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Track URL',
      type: 'url',
      description: 'Paste a full SoundCloud or Spotify track URL. For SoundCloud, use the public track page or a numeric API track URL, not a short share link.',
      validation: (rule) => rule.required().custom((value, context) =>
        providerUrlValidation(context.document?.provider as string | undefined, value),
      ),
    }),
    defineField({
      name: 'playbackLabel',
      title: 'Soundbar label',
      type: 'string',
      description: 'Optional. Defaults to the title; SoundCloud row playback also includes performer/details.',
      validation: (rule) => rule.custom(noEmDash),
    }),
    defineField({name: 'playbackKey', type: 'string', hidden: true, readOnly: true}),
    defineField({name: 'playerId', type: 'string', hidden: true, readOnly: true}),
  ],
  preview: {
    select: {title: 'title', provider: 'provider', year: 'year'},
    prepare: ({title, provider, year}) => ({title, subtitle: `${provider} · ${year || 'Undated'}`}),
  },
})
