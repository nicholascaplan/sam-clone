# Test Strategy

## Purpose

Catch regressions before GitHub Pages deployment without turning this static portfolio into a heavily tested application.

## Recommended Approach

- Use Playwright for browser-level smoke tests.
- Serve the repository through a local HTTP server, matching the documented development path.
- Run tests against the local site before uploading the Pages artifact.
- Prefer user-visible behavior and stable IDs, roles, and labels over CSS implementation details.

## Current Smoke-Test Scope

The current Playwright suite covers:

- Page load, title, and critical assets.
- Primary navigation between Biography, Works, Listen & Watch, Writing, and Contact.
- Works category filtering and search, including the empty result state.
- Light/dark theme switching.
- Desktop and mobile menu behavior, including mobile navigation to another section.
- Mobile menu parity with the primary navigation, so adding a navigation item without its mobile equivalent fails the smoke test.
- Listen & Watch tab switching.
- Work-detail and YouTube modal open/close behavior without attempting provider playback.
- Score-request journey from the works list to a prefilled contact message.
- Contact form confirmation behavior without external submission.
- Deep links for Works, Listen & Watch, Writing, and Contact.
- Serious and critical WCAG 2 A/AA accessibility violations on the homepage.

The accessibility scan covers the default light theme, which is the initial page state.

## Future Coverage

- Password-gate behavior when testing the deployed-host mode.
- SoundCloud and Spotify playback state using mocked provider APIs.
- Responsive visual regressions only if a stable screenshot review process is needed.

## Deliberately Excluded From Live Smoke Tests

- Exact spacing, colors, typography, or screenshots.
- Animation timing and transient visual states.
- Live SoundCloud, Spotify, YouTube, font, and CDN behavior.
- Exact full-page text or content counts.

Third-party media should be checked manually or covered later with mocked integration tests. Live-provider tests would be slower and more vulnerable to unrelated network or provider changes.

## Brittleness Controls

- Select by accessible role, visible name, or purpose-specific ID.
- Assert outcomes, such as a section becoming visible, rather than CSS classes.
- Keep each test focused on one user-facing behavior.
- Avoid depending on third-party requests unless the test explicitly targets them.
- Add tests when a regression is found, rather than aiming for exhaustive coverage.

## Deployment Plan

The eventual GitHub Actions order should be:

1. Check out the repository.
2. Install test dependencies and browsers.
3. Start the local static server through Playwright's web server support.
4. Run the smoke tests.
5. Build an allowlisted Pages artifact containing only `index.html` and `assets/`.
6. Deploy to GitHub Pages.

The proof of concept is intentionally local first. Deployment workflow integration should follow once the test command has been run successfully in CI or an equivalent clean environment.

## Initial Proof of Concept

The initial test verified that `index.html` loads through HTTP, has the expected document title, and renders the primary navigation. The suite has since expanded with the local interaction coverage listed above.
