import {replaceRegion} from './biography.mjs'
import {parseMediaUrl} from './media-url.mjs'

export const CATALOGUE_QUERY = `{
  "settings": *[_id == "worksMediaSettings"][0]{
    eyebrow, heading, worksDescription, listenDescription, watchDescription, availability,
    "defaultRecording": defaultRecording->_id
  },
  "works": *[_type == "work"] | order(_id){
    "id": _id, title, year, category, instrumentation, duration, commission, premiere, notes
  },
  "media": *[_type in ["recording", "film"]] | order(_id){
    "key": _id, "type": select(_type == "recording" => "listen", "watch"),
    title, year, duration, detail, provider, url, category, actionLabel, actionOrder, playbackLabel,
    "id": coalesce(playbackKey, _id), playerId, "workId": work->_id
  }
}`

export function safeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

export function readCatalogueFallback(html) {
  const match = html.match(/<script id="catalogueData" type="application\/json">([\s\S]*?)<\/script>/)
  if (!match) throw new Error('Catalogue fallback JSON not found')
  return JSON.parse(match[1])
}

const categories = ['chamber', 'vocal', 'ensemble', 'opera', 'orchestral']
const identifier = value => typeof value === 'string' && /^[A-Za-z0-9_.-]+$/.test(value) && !value.startsWith('drafts.')
const text = value => typeof value === 'string' && value.trim().length > 0
const year = value => value == null || (Number.isInteger(value) && value >= 1000 && value <= 9999)

export function prepareCatalogue(snapshot) {
  const data = structuredClone(snapshot)
  const problems = []
  const check = (condition, message) => { if (!condition) problems.push(message) }
  for (const field of ['eyebrow', 'heading', 'worksDescription', 'listenDescription', 'watchDescription', 'availability']) {
    check(text(data?.settings?.[field]), `settings.${field}`)
  }
  check(Array.isArray(data?.works), 'works must be an array')
  check(Array.isArray(data?.media), 'media must be an array')
  if (problems.length) throw new Error(`Invalid catalogue: ${problems.join(', ')}`)
  const workIds = new Set()
  for (const work of data.works) {
    check(identifier(work.id) && !workIds.has(work.id), 'work IDs must be unique published identifiers')
    workIds.add(work.id)
    for (const field of ['title', 'instrumentation']) check(text(work[field]), `${work.id}.${field}`)
    check(categories.includes(work.category), `${work.id}.category`)
    check(work.year != null && year(work.year), `${work.id}.year`)
    for (const field of ['duration', 'commission', 'premiere', 'notes']) {
      check(work[field] == null || typeof work[field] === 'string', `${work.id}.${field}`)
    }
  }
  const mediaKeys = new Set()
  const playbackIds = new Set()
  const playerIds = new Set()
  for (const media of data.media) {
    check(identifier(media.key) && !mediaKeys.has(media.key), 'media keys must be unique published identifiers')
    mediaKeys.add(media.key)
    check(['listen', 'watch'].includes(media.type), `${media.key}.type`)
    for (const field of ['title', 'detail']) check(text(media[field]), `${media.key}.${field}`)
    check(year(media.year), `${media.key}.year`)
    check(media.workId == null || workIds.has(media.workId), `${media.key}.workId is not published`)
    check(media.category == null || categories.includes(media.category), `${media.key}.category`)
    for (const field of ['duration', 'playbackLabel', 'actionLabel']) {
      check(media[field] == null || typeof media[field] === 'string', `${media.key}.${field}`)
    }
    check(media.duration == null || /^\d+:[0-5]\d$/.test(media.duration), `${media.key}.duration`)
    media.actionOrder ??= 0
    check(Number.isInteger(media.actionOrder) && media.actionOrder >= 0, `${media.key}.actionOrder`)
    if (media.type === 'watch') {
      check(media.actionLabel == null || ['Watch', 'Trailer', 'Performance excerpt', 'Insights'].includes(media.actionLabel), `${media.key}.actionLabel`)
    } else check(['spotify', 'soundcloud'].includes(media.provider), `${media.key}.provider`)
    try {
      const parsed = parseMediaUrl(media.type === 'watch' ? 'youtube' : media.provider, media.url)
      media.url = parsed.url
      if (media.provider === 'spotify') media.id = parsed.id
    } catch (error) { problems.push(`${media.key}.url: ${error.message}`) }
    if (media.type === 'listen') {
      check(identifier(media.id), `${media.key}.playback ID`)
      const playbackId = `${media.provider}:${media.id}`
      check(!playbackIds.has(playbackId), `${media.key} duplicates a playback ID`)
      playbackIds.add(playbackId)
      if (media.provider === 'soundcloud') {
        media.playerId ||= `soundcloudPlayer-${media.id}`
        check(identifier(media.playerId) && media.playerId.startsWith('soundcloudPlayer') && !playerIds.has(media.playerId), `${media.key}.playerId`)
        playerIds.add(media.playerId)
      }
    }
  }
  check(data.settings.defaultRecording == null || data.media.some(media => media.key === data.settings.defaultRecording && media.type === 'listen'), 'defaultRecording must reference a published recording')
  if (problems.length) throw new Error(`Invalid catalogue: ${problems.join(', ')}`)
  return data
}

export function renderCatalogue(html, snapshot) {
  const data = prepareCatalogue(snapshot)
  // Build both replacements before returning: a failure cannot produce a partial snapshot.
  const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (!script) throw new Error('Site structured data not found')
  const structuredData = JSON.parse(script[1])
  const worksList = structuredData['@graph'].find(item => item['@type'] === 'ItemList')
  if (!worksList) throw new Error('Composition ItemList not found')
  worksList.itemListElement = [...data.works]
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
    .map((work, index) => ({
      '@type': 'ListItem', position: index + 1,
      item: {'@type': 'MusicComposition', name: work.title, dateCreated: String(work.year),
        description: `${work.instrumentation}${work.commission ? `. Commissioned by ${work.commission}` : ''}`},
    }))
  const withCatalogue = replaceRegion(html, 'catalogue', `<script id="catalogueData" type="application/json">\n${safeJson(data)}\n    </script>`)
  return withCatalogue.replace(script[0], () => `<script type="application/ld+json">\n${safeJson(structuredData)}\n    </script>`)
}

export async function buildCatalogue(html, fetchSnapshot, warn = console.warn) {
  try {
    return {html: renderCatalogue(html, await fetchSnapshot()), usedFallback: false}
  } catch (error) {
    warn(`::warning::Sanity catalogue unavailable, using committed Works & Media fallback. ${error.message}`)
    return {html, usedFallback: true}
  }
}
