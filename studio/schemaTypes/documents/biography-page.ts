import {defineArrayMember, defineField, defineType} from 'sanity'
import {noEmDash} from '../shared/validation'

export const biographyPage = defineType({
  name: 'biographyPage',
  title: 'Biography Page',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
      initialValue: 'Biography',
      validation: (rule) => rule.required().custom(noEmDash),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Samantha Fernando',
      validation: (rule) => rule.required().custom(noEmDash),
    }),
    defineField({
      name: 'body',
      title: 'Biography text',
      description:
        'Use bold for ensemble and organisation names and italic for work titles. British English, no em dashes, no Oxford commas.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [],
          },
        }),
      ],
      validation: (rule) =>
        rule.required().min(1).custom((blocks) => {
          const text = JSON.stringify(blocks ?? [])
          return text.includes('\\u2014') || text.includes('\u2014')
            ? 'Do not use em dashes. Use a comma, colon or full stop instead.'
            : true
        }),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      description: 'Used beside the biography on desktop and as a compact circular portrait on mobile.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().custom(noEmDash),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactCtaLabel',
      title: 'Contact button label',
      description: 'The button always opens the Contact page.',
      type: 'string',
      initialValue: 'Discuss a commission or performance',
      validation: (rule) => rule.required().custom(noEmDash),
    }),
    defineField({
      name: 'milestonesHeading',
      title: 'Milestones heading',
      type: 'string',
      initialValue: 'Selected Milestones',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'milestones',
      title: 'Milestones',
      description: 'Newest first.',
      type: 'array',
      of: [defineArrayMember({type: 'milestone'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'educationHeading',
      title: 'Education heading',
      type: 'string',
      initialValue: 'Education & Fellowship',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'education',
      title: 'Education and fellowship',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().custom(noEmDash),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Biography Page'}),
  },
})
