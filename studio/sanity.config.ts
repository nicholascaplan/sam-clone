import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SINGLETON_TYPES, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Samantha Fernando Website',

  projectId: '9a66iw1t',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETON_TYPES.includes(schemaType)),
  },

  document: {
    actions: (input, {schemaType}) =>
      SINGLETON_TYPES.includes(schemaType)
        ? input.filter(({action}) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : input,
  },
})
