# Samantha Fernando Website

Static single-page portfolio for composer Samantha Fernando. Biography, works, recordings, writing and contact information use in-page routes in `index.html`.

## Technical Overview

- Plain HTML, CSS, and JavaScript in `index.html`.
- Compiled Tailwind CSS in `assets/tailwind.min.css`; Font Awesome and Google Fonts loaded from CDNs.
- SoundCloud Widget API for verified SoundCloud recordings.
- Spotify track playback through the Spotify IFrame API.
- A unified Works & Media catalogue. `Works` opens all works, `Listen` opens thirteen recordings and `Watch` opens twelve films.
- YouTube videos open in an in-page modal from thumbnail cards.
- GitHub Pages deployment from the `main` branch.

## Content (Sanity)

The Biography is edited in Sanity Studio (`studio/`, project `9a66iw1t`) and baked into the page at build time.

```bash
npm run build:content        # writes the publishable site to _site/ using live Sanity content
cd studio && npm run dev     # run the Studio locally
cd studio && npm run deploy  # publish the hosted Studio after schema changes
```

If Sanity is unavailable, `build:content` keeps the committed Biography markup in `index.html`. `scripts/seed-biography.ts` in `studio/scripts/` recreates the document from the original copy.

## Run Locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Serve the site over HTTP rather than opening it with `file://`.

## Tests

Install dependencies and Chromium once with `npm install` and `npx playwright install chromium`, then run `npm test`. The test starts the local HTTP server automatically. Use `npm run test:all` for the full browser matrix.

## Deployment

- Production domain: <https://www.samanthafernando.com/>
