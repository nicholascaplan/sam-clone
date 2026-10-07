import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {buildCatalogue, CATALOGUE_QUERY, prepareCatalogue, readCatalogueFallback, renderCatalogue, safeJson} from '../scripts/lib/catalogue.mjs'
import {parseMediaUrl} from '../scripts/lib/media-url.mjs'
import {seedCatalogue} from '../scripts/lib/seed-catalogue.mjs'

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const fallback = readCatalogueFallback(html)
const fixture = () => structuredClone(fallback)

test('fallback contains the complete working catalogue and valid provider configuration', () => {
  const data = prepareCatalogue(fallback)
  assert.equal(data.works.length, 23)
  assert.equal(data.media.filter(media => media.type === 'listen').length, 13)
  assert.equal(data.media.filter(media => media.type === 'watch').length, 11)
  assert.equal(data.media.find(media => media.key === data.settings.defaultRecording).provider, 'spotify')
  const seo = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  const works = seo['@graph'].find(item => item['@type'] === 'ItemList').itemListElement
  assert.deepEqual(works.map(item => [item.item.name, item.item.dateCreated]).sort(), data.works.map(work => [work.title, String(work.year)]).sort())
  assert.match(CATALOGUE_QUERY, /work->_id/)
  assert.match(CATALOGUE_QUERY, /defaultRecording->_id/)
})

test('published snapshot updates JSON and structured data together without changing other sections', () => {
  const data = fixture()
  data.works[0].title = 'Renamed <composition>'
  const result = renderCatalogue(html, data)
  assert.equal(readCatalogueFallback(result).works[0].title, 'Renamed <composition>')
  assert.equal(readCatalogueFallback(result).media[3].workId, data.works[0].id)
  const seo = JSON.parse(result.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  const works = seo['@graph'].find(item => item['@type'] === 'ItemList').itemListElement
  assert.equal(works.length, data.works.length)
  assert.ok(works.some(item => item.item.name === 'Renamed <composition>'))
  assert.equal(result.match(/<!-- sanity:biography:start[\s\S]*?<!-- sanity:biography:end -->/)[0], html.match(/<!-- sanity:biography:start[\s\S]*?<!-- sanity:biography:end -->/)[0])
})

test('JSON cannot close its script or inject markup', () => {
  const malicious = '</script><img src=x onerror=alert(1)> & \u2028\u2029'
  const encoded = safeJson({title: malicious})
  assert.ok(!encoded.includes('<'))
  assert.deepEqual(JSON.parse(encoded), {title: malicious})
  const data = fixture()
  data.works[0].title = malicious
  const result = renderCatalogue(html, data)
  assert.equal(readCatalogueFallback(result).works[0].title, malicious)
  assert.ok(!result.includes('<img src=x'))
})

test('empty published lists do not restore deleted content or a default track', () => {
  const data = fixture()
  data.works = []
  data.media = []
  data.settings.defaultRecording = null
  const result = readCatalogueFallback(renderCatalogue(html, data))
  assert.deepEqual(result.works, [])
  assert.deepEqual(result.media, [])
})

test('incomplete documents, unsafe selectors, duplicate keys and broken references are rejected', () => {
  for (const mutate of [
    data => { data.settings = null },
    data => { data.works[0].title = '' },
    data => { data.works[0].category = 'unknown' },
    data => { data.media[0].id = 'x" onclick="alert(1)' },
    data => { data.media[0].key = data.media[1].key },
    data => { data.media[0].workId = 'missing-work' },
    data => { data.media[0].url = 'javascript:alert(1)' },
    data => { data.media[0].actionOrder = -1 },
    data => { data.settings.defaultRecording = data.media.find(media => media.type === 'watch').key },
    data => { data.works[0].year = '2023' },
    data => { data.media[0].id = 'drafts.recording' },
  ]) {
    const data = fixture()
    mutate(data)
    assert.throws(() => prepareCatalogue(data), /Invalid catalogue/)
  }
})

test('provider URL validation canonicalises supported forms and rejects lookalikes and playlists', () => {
  assert.equal(parseMediaUrl('youtube', 'https://youtu.be/5BApW0VSCes?t=2').url, 'https://www.youtube.com/watch?v=5BApW0VSCes')
  assert.equal(parseMediaUrl('spotify', 'https://open.spotify.com/intl-en/track/2wNL47uCuwDpbOqCIpbSTS?si=example').id, '2wNL47uCuwDpbOqCIpbSTS')
  assert.equal(parseMediaUrl('soundcloud', 'https://soundcloud.com/samanthafernando/kinesphere-for-solo-flute-extract').url, 'https://soundcloud.com/samanthafernando/kinesphere-for-solo-flute-extract')
  for (const [provider, url] of [
    ['youtube', 'https://youtube.com.evil.example/watch?v=5BApW0VSCes'],
    ['youtube', 'https://www.youtube.com/watch?v=<img>'],
    ['youtube', 'https://placeholder:placeholder@www.youtube.com/watch?v=5BApW0VSCes'],
    ['spotify', 'https://open.spotify.com/album/2wNL47uCuwDpbOqCIpbSTS'],
    ['soundcloud', 'https://on.soundcloud.com/example'],
    ['soundcloud', 'https://soundcloud.com/samanthafernando/example?secret_token=placeholder'],
    ['soundcloud', 'https://soundcloud.com/samanthafernando/sets/example'],
  ]) assert.throws(() => parseMediaUrl(provider, url))
})

test('network and validation failures preserve the complete incoming HTML', async () => {
  for (const fetchSnapshot of [async () => { throw new Error('offline') }, async () => ({settings: null})]) {
    const warnings = []
    const result = await buildCatalogue(html, fetchSnapshot, warning => warnings.push(warning))
    assert.equal(result.html, html)
    assert.equal(result.usedFallback, true)
    assert.equal(warnings.length, 1)
  }
  const result = await buildCatalogue(html, async () => fixture())
  assert.equal(result.usedFallback, false)
})

test('default recording supports either provider and unpublished selections can be cleared', () => {
  const data = fixture()
  data.settings.defaultRecording = data.media[0].key
  assert.equal(prepareCatalogue(data).settings.defaultRecording, data.media[0].key)
  data.settings.defaultRecording = null
  assert.equal(prepareCatalogue(data).settings.defaultRecording, null)
})

test('published-reference projections can remove a Work without resurrecting it or its default', async () => {
  const data = fixture()
  data.works = data.works.filter(work => work.id !== 'work-6')
  // GROQ work->_id and defaultRecording->_id resolve to null after unpublish.
  data.media[0].workId = null
  data.settings.defaultRecording = null
  const result = await buildCatalogue(html, async () => data)
  assert.equal(result.usedFallback, false)
  const rendered = readCatalogueFallback(result.html)
  assert.equal(rendered.works.length, 22)
  assert.ok(!rendered.works.some(work => work.id === 'work-6'))
  assert.ok(rendered.media.some(media => media.key === 'soundcloud-illuminations'))
})

test('import uses generated IDs and returned references, and reruns never overwrite editors', async () => {
  const docs = []
  const client = {
    fetch: async () => structuredClone(docs),
    create: async fields => {
      assert.equal(fields._id, undefined)
      const doc = {_id: `generated-${docs.length}`, ...fields}
      docs.push(doc)
      return doc
    },
    createIfNotExists: async fields => { docs.push(fields); return fields },
  }
  assert.equal((await seedCatalogue(client, fixture())).created, 48)
  const recording = docs.find(doc => doc._type === 'recording' && doc.title === 'Balconies')
  assert.equal(recording.work._ref, docs.find(doc => doc._type === 'work' && doc.title === 'Balconies')._id)
  const settings = docs.find(doc => doc._type === 'worksMediaSettings')
  assert.equal(settings.defaultRecording._ref, docs.find(doc => doc.sourceKey === fallback.settings.defaultRecording)._id)
  docs[0].title = 'Editor revision'
  assert.equal((await seedCatalogue(client, fixture())).created, 0)
  assert.equal(docs[0].title, 'Editor revision')
})

test('import refuses draft-only imported documents before writing', async () => {
  let writes = 0
  const client = {
    fetch: async () => [{_type: 'work', _id: 'drafts.example', sourceKey: 'work-1'}],
    create: async () => { writes += 1 },
  }
  await assert.rejects(seedCatalogue(client, fixture()), /existing draft/)
  assert.equal(writes, 0)
})

test('import refuses duplicate source identities before creating documents', async () => {
  let writes = 0
  const client = {
    fetch: async () => [
      {_type: 'work', _id: 'one', sourceKey: 'work-1'},
      {_type: 'work', _id: 'two', sourceKey: 'work-1'},
    ],
    create: async () => { writes += 1 },
  }
  await assert.rejects(seedCatalogue(client, fixture()), /Duplicate import source key/)
  assert.equal(writes, 0)
})
