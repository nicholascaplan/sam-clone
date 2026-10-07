import {prepareCatalogue} from './catalogue.mjs'

// Import source keys identify previously imported documents, never their Sanity IDs.
// Existing published documents and drafts are not patched or overwritten.
export async function seedCatalogue(client, snapshot) {
  const data = prepareCatalogue(snapshot)
  const existing = await client.fetch(`*[_type in ["work", "recording", "film", "worksMediaSettings"]]{_id, _type, sourceKey}`)
  const bySource = new Map()
  for (const doc of existing) {
    if (!doc.sourceKey) continue
    const key = `${doc._type}:${doc.sourceKey}`
    const id = doc._id.replace(/^drafts\./, '')
    const previous = bySource.get(key)
    if (previous && previous.id !== id) throw new Error(`Duplicate import source key: ${key}`)
    bySource.set(key, {id, published: previous?.published || !doc._id.startsWith('drafts.')})
  }
  if (existing.some(doc => doc._type === 'worksMediaSettings' && doc._id === 'drafts.worksMediaSettings')) {
    throw new Error('Publish or resolve the existing draft worksMediaSettings before importing. No documents have been written.')
  }
  for (const [key, doc] of bySource) {
    if (!doc.published) throw new Error(`Publish or resolve the existing draft ${key} before importing. No documents have been written.`)
  }
  let created = 0
  const ensure = async (_type, sourceKey, fields) => {
    const found = bySource.get(`${_type}:${sourceKey}`)
    if (found) return found.id
    const doc = await client.create({_type, sourceKey, ...fields})
    bySource.set(`${_type}:${sourceKey}`, {id: doc._id, published: true})
    created += 1
    return doc._id
  }
  const workIds = new Map()
  for (const {id, ...fields} of data.works) {
    workIds.set(id, await ensure('work', id, fields))
  }
  const recordingIds = new Map()
  for (const media of data.media) {
    const {key, type, id, playerId, workId, ...fields} = media
    const documentId = await ensure(type === 'listen' ? 'recording' : 'film', key, {
      ...fields,
      ...(workId ? {work: {_type: 'reference', _ref: workIds.get(workId)}} : {}),
      ...(type === 'listen' && media.provider === 'soundcloud' ? {playbackKey: id, playerId} : {}),
    })
    if (type === 'listen') recordingIds.set(key, documentId)
  }
  if (!existing.some(doc => ['worksMediaSettings', 'drafts.worksMediaSettings'].includes(doc._id))) {
    const {defaultRecording, ...fields} = data.settings
    await client.createIfNotExists({
      _id: 'worksMediaSettings', _type: 'worksMediaSettings', ...fields,
      ...(defaultRecording ? {defaultRecording: {_type: 'reference', _ref: recordingIds.get(defaultRecording)}} : {}),
    })
    created += 1
  }
  return {created}
}
