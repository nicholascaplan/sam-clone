import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
let counter = 0
const key = () => `k${(counter++).toString(36)}`

const t = (text: string, ...marks: string[]): Span => ({_type: 'span', _key: key(), text, marks})
const p = (...children: Span[]) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children,
})

const body = [
  p(
    t(
      'In recent years, her music has moved towards a language that values clarity, directness, and openness: working with deliberately limited material, allowing music time to breathe, and attending with precision to gesture, texture, and form.',
    ),
  ),
  p(
    t(
      'Collaboration with performers is central to her practice, particularly in shaping sound worlds that respond to the physicality of instruments and the acoustic space in which music is heard.',
    ),
  ),
  p(
    t('Samantha has worked with numerous world-leading ensembles including the '),
    t('Philharmonia Orchestra', 'strong'),
    t(', '),
    t('London Sinfonietta', 'strong'),
    t(', '),
    t('BCMG', 'strong'),
    t(', '),
    t('Riot Ensemble', 'strong'),
    t(', '),
    t('The BBC Singers', 'strong'),
    t(', '),
    t('LOD Muziektheater (Ghent)', 'strong'),
    t(', '),
    t('Silbersee Vocal Ensemble (Amsterdam)', 'strong'),
    t(' and '),
    t('The Crossing (USA)', 'strong'),
    t(
      '. Her music has been performed at major international festivals including Aldeburgh Music, Huddersfield Contemporary Music Festival, Sounds New, Gaudeamus Muziekweek, York Late Music and the Oxford Lieder Festival.',
    ),
  ),
  p(
    t(
      'Samantha studied Composition at the Royal Academy of Music and the University of Oxford. She holds a PhD in Composition. She is an Honorary Research Fellow in Composition at Royal Holloway, University of London.',
    ),
  ),
  p(
    t('In 2021, Samantha saw the opening of '),
    t('Current, Rising', 'em'),
    t(
      ', a world-first hyper-reality opera experience produced by the Royal Opera House and Figment Productions. Her chamber opera ',
    ),
    t('glass human', 'em'),
    t(
      ', created in collaboration with Melanie Wilson, premiered at Glyndebourne in Autumn 2022. Recent commissions include ',
    ),
    t('Sound Inhabitants', 'em'),
    t(' for the London Sinfonietta and '),
    t('Wintering', 'em'),
    t(
      ', commissioned by Wigmore Hall and performed by Manchester Collective and The Marian Consort.',
    ),
  ),
]

const milestones = [
  ['2025', 'The Exoplanets: TRAPPIST-1e', 'City of London Sinfonia'],
  ['2025', 'Wintering', 'Wigmore Hall commission'],
  ['2023', 'Sound Inhabitants', 'London Sinfonietta'],
  ['2022', 'glass human', 'Glyndebourne premiere'],
  ['2021', 'Current, Rising', 'Royal Opera House'],
].map(([year, title, detail]) => ({_type: 'milestone', _key: key(), year, title, detail}))

async function main() {
  const asset = await client.assets.upload(
    'image',
    createReadStream(resolve(process.cwd(), '../assets/sam-1-1200.webp')),
    {filename: 'sam-1-1200.webp'},
  )

  await client.createOrReplace({
    _id: 'biographyPage',
    _type: 'biographyPage',
    eyebrow: 'Biography',
    heading: 'Samantha Fernando',
    body,
    portrait: {
      _type: 'image',
      asset: {_type: 'reference', _ref: asset._id},
      alt: 'Samantha Fernando standing among green foliage',
    },
    contactCtaLabel: 'Discuss a commission or performance',
    milestonesHeading: 'Selected Milestones',
    milestones,
    educationHeading: 'Education & Fellowship',
    education:
      'Royal Academy of Music and University of Oxford. Honorary Research Fellow at Royal Holloway, University of London.',
  })
  console.log('Seeded biographyPage (draft-free published document)')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
