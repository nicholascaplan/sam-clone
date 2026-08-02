# Samantha Fernando Website

Static single-page portfolio for composer Samantha Fernando. Biography, works, recordings, writing and contact information use in-page routes in `index.html`.

## Technical Overview

- Plain HTML, CSS, and JavaScript in `index.html`.
- Tailwind CSS, Font Awesome, and Google Fonts loaded from CDNs.
- SoundCloud Widget API for verified SoundCloud recordings.
- Spotify track playback through the Spotify IFrame API.
- A unified Works & Media catalogue. `Works List` opens all works while `Listen & Watch` opens its recordings view; the same catalogue also filters to ten films.
- YouTube videos open in an in-page modal from thumbnail cards.
- GitHub Pages deployment from the `main` branch.

## Run Locally

If the `sam-website` alias is configured in your zsh shell, start the site with:

```bash
sam-website
```

This changes to the project directory and runs the server on port 8000. To run it directly instead:

```bash
python3 -m http.server 8000 --directory /Users/nicholascaplan/sam-website
```

Open <http://localhost:8000>. The site should be served over HTTP rather than opened directly as a `file://` URL. The explicit directory option avoids issues when the shell cannot resolve its current working directory.

## Tests

Install the test dependency and browser once with `npm install` and `npx playwright install chromium`, then run the smoke test with `npm test`. The test starts the local HTTP server automatically.

## Deployment

- Live site: <https://nicholascaplan.github.io/sam-clone/>
