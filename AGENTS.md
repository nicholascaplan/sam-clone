# Samantha Fernando Site

## GitHub Pages

- Repository: https://github.com/nicholascaplan/sam-clone
- Published site: https://nicholascaplan.github.io/sam-clone/
- Deployment workflow: `.github/workflows/pages.yml`
- Deployment branch: `main`

## Project Notes

- This is a static GitHub Pages site.
- The site includes an intentionally insecure client-side password gate for testing.
- SoundCloud playback uses the SoundCloud Widget API. Spotify recordings use embedded Spotify players.

## Documentation

- `README.md` is the concise public project overview.
- `NextSteps.md` contains content follow-ups, verification notes, and known constraints.
- `Website Content Map & Specifications.md` contains the source content map.
- `Website Critique & Redesign Strategy.md` contains design and information-architecture recommendations.

## Maintenance Notes

- Keep the SoundCloud iframe in the document and visually hidden; `display: none` can prevent widget initialisation.
- Update playback UI from SoundCloud widget events rather than assuming that a call to `play()` succeeded.
- Preserve the editorial visual language, readable contrast, and responsive layouts when changing the page.
