import type {StructureResolver} from 'sanity/structure'

export const SINGLETON_TYPES = ['biographyPage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Biography Page')
        .id('biographyPage')
        .child(
          S.document().schemaType('biographyPage').documentId('biographyPage').title('Biography Page'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.includes(item.getId() as string)),
    ])
