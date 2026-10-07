import {readFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'
import {readCatalogueFallback} from '../../scripts/lib/catalogue.mjs'
import {seedCatalogue} from '../../scripts/lib/seed-catalogue.mjs'

// Explicit maintainer command only. This publishes new documents, triggering the
// webhook once catalogue types are enabled. It never overwrites editor changes.
const client = getCliClient({apiVersion: '2025-02-19'}).withConfig({perspective: 'raw', useCdn: false})

async function main() {
  const html = await readFile(resolve(process.cwd(), '..', 'index.html'), 'utf8')
  const result = await seedCatalogue(client, readCatalogueFallback(html))
  console.log(`Catalogue import complete: ${result.created} documents created; existing content left unchanged.`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Catalogue import failed.')
  process.exitCode = 1
})
