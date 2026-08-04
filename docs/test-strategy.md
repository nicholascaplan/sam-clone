# Test Strategy

Use Playwright smoke tests to protect visitor-facing behaviour without coupling tests to layout implementation.

## Run

```bash
npm test
```

`npm test` runs Chromium. Use `npm run test:all` for the complete browser and tagged-mobile matrix. Playwright starts the local HTTP server.

## Covered

- Page load, core assets and navigation.
- Hash routes, browser history, Works/Listen/Watch filters and search.
- Persisted theme switching, including dark-mode instrumentation and mobile-navigation menus. Theme-dependent interactive states are exercised in both light and dark modes.
- Works and YouTube modals, score-request flow and contact-form success/failure states.
- Mocked Spotify and SoundCloud playback state, including provider hand-off.
- Password-gate behaviour on the deployed hostname mapped to the local server.
- Serious and critical Axe violations across interactive states.

## Principles

- Select by accessible role, visible name or stable ID.
- Assert visitor outcomes rather than CSS classes, spacing or exact copy.
- Mock third-party providers. Verify live media manually on the deployed site.
- Add regression coverage when a defect is fixed.

## Deployment

The Pages workflow must run tests and publish an allowlisted artifact containing only `index.html` and `assets/`. Verify the GitHub Actions deployment after each push; live-site propagation should be checked separately.
