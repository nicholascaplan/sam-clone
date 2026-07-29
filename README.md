# Samantha Fernando Website

Static single-page portfolio for composer Samantha Fernando. It presents her biography, works, performances, writing, recordings, and contact information.

## Technical Overview

- Plain HTML, CSS, and JavaScript in `index.html`.
- Tailwind CSS, Font Awesome, and Google Fonts loaded from CDNs.
- SoundCloud Widget API for verified SoundCloud recordings.
- Spotify track playback through the Spotify IFrame API.
- A combined `Listen & Watch` page with internal Listen and Watch tabs.
- YouTube videos open in an in-page modal from thumbnail cards.
- GitHub Pages deployment through `.github/workflows/pages.yml`.

## Run Locally

```bash
python3 -m http.server 8000 --directory /Users/nicholascaplan/sam-website
```

Open <http://localhost:8000>. The site should be served over HTTP rather than opened directly as a `file://` URL. The explicit directory option avoids issues when the shell cannot resolve its current working directory.

## Deployment

- Repository: <https://github.com/nicholascaplan/sam-clone>
- Live site: <https://nicholascaplan.github.io/sam-clone/>

Project maintenance notes and future work are documented in [`AGENTS.md`](AGENTS.md) and [`NextSteps.md`](NextSteps.md).
