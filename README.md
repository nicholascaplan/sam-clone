# Samantha Fernando Website

Static single-page portfolio for composer Samantha Fernando. Biography, works, recordings, writing and contact information use in-page routes in `index.html`.

## Technical Overview

- Plain HTML, CSS, and JavaScript in `index.html`.
- Compiled Tailwind CSS in `assets/tailwind.min.css`; Font Awesome and Google Fonts loaded from CDNs.
- SoundCloud Widget API for verified SoundCloud recordings.
- Spotify track playback through the Spotify IFrame API.
- A unified Works & Media catalogue. `Works List` opens all works, `Listen` opens recordings and `Watch` opens ten films.
- YouTube videos open in an in-page modal from thumbnail cards.
- GitHub Pages deployment from the `main` branch.

## Run Locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Serve the site over HTTP rather than opening it with `file://`.

## Tests

Install dependencies and Chromium once with `npm install` and `npx playwright install chromium`, then run `npm test`. The test starts the local HTTP server automatically. Use `npm run test:all` for the full browser matrix.

## Deployment

- Live site: <https://nicholascaplan.github.io/sam-clone/>
