import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {noEmDash} from '../shared/validation'

export const worksMediaSettings = defineType({
  name: 'worksMediaSettings', title: 'Works & Media Settings', type: 'document', icon: CogIcon,
  fields: [
    ...[
      ['eyebrow', 'Eyebrow label'], ['heading', 'Heading'],
      ['worksDescription', 'Works introductory text'], ['listenDescription', 'Listen introductory text'],
      ['watchDescription', 'Watch introductory text'], ['availability', 'Recording availability note'],
    ].map(([name, title]) => defineField({name, title, type: name === 'availability' ? 'text' : 'string', validation: (rule) => rule.required().custom(noEmDash)})),
    defineField({
      name: 'defaultRecording', title: 'Default header recording', type: 'reference', to: [{type: 'recording'}],
      description: 'Plays when the header Listen control is first used, and after Stop. Publish the recording first. If blank, the header opens the Listen catalogue instead.',
    }),
  ],
  preview: {prepare: () => ({title: 'Works & Media Settings'})},
})
