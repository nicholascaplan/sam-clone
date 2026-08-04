# Decisions

Record only decisions that constrain future work. Implementation history and completed tasks do not belong here.

## Architecture

- Keep a single `index.html` with hash routes until a planned architecture split is approved. Separate pages would duplicate navigation, theme, password-gate and playback behaviour.
- Push browser-history entries for deliberate section and Works & Media view changes. Restore the matching state on `popstate`.
- Keep the homepage URL free of a redundant `#bio` fragment.
- Keep local design experiments in Git-ignored `design/`; do not publish them.

## Content And Navigation

- Keep Biography at `#bio`. The root route remains the quote-led homepage with Spotlight Works.
- Use one Works & Media catalogue. Works opens All Works, Listen opens recordings and Watch opens films.
- Treat Listen and Watch as filters, not standalone public pages.
- Keep event records newest first in the content source. Events are not currently rendered on the public homepage.
- Use a consistent Works card order: year, category, duration, title, instrumentation, commission, premiere and optional notes.
- Use a category pill only for the controlled work category. Keep venues, ensembles, awards and recording details in the appropriate metadata field.
- Do not use horizontal separators beneath primary page-intro copy; title, description and section spacing provide the transition. Retain dividers only where they structure content within a component.

## Media And Interaction

- Keep the light theme as the default and persist an explicit visitor theme selection locally. Every new or changed visual surface, including transient menus, hover, focus, selected and disabled states, must define dark defaults and light-mode overrides.
- Render compact Works and Listen cards. Render Watch as thumbnail-led YouTube cards that open the in-page modal.
- Show only the year in Watch metadata. Do not repeat the implied `Film` label.
- Use `Preview` for Spotify and `Listen` for SoundCloud actions. Show a related-work category and duration when known.
- Keep audio playback and the soundbar active during in-page navigation. SoundCloud players initialise after page load and queue early requests.
- Use the custom playback rows rather than provider-native embeds. Native embeds add uncontrollable UI and inconsistent mobile sizing.
- Use a shared media-action width on desktop; stack multiple actions there and use equal-width paired actions on mobile. Left-align single mobile media actions.
- Use a neutral treatment for availability and missing-metadata notices unless an actual error occurred.
- Use role-based colour tokens and a shared visible focus treatment for interactive controls. Preserve the current amber focus colour in dark mode and the darker amber focus colour in light mode.

## Responsive And Performance

- Use the real page in a `430px` iframe for desktop mobile preview. Do not create preview-only responsive CSS.
- Keep compact mobile layout rules in the page's narrow-screen media queries, including the 3.5rem header, icon-only narrow-phone sound control, persistent top-right menu close control and 13rem hero portrait.
- Preload `assets/sam-1-1200.webp` for the homepage hero. Load the smaller `assets/sam-6-800.webp` contact portrait eagerly at low priority.
- Load the visible Writing portrait (`assets/sam-3.webp`) eagerly at high priority; keep below-the-fold catalogue and video thumbnails lazy-loaded.

## Testing And Deployment

- Test provider integrations through mocked browser APIs, not live providers.
- Test the deployed-host password-gate condition locally without duplicating its credential in tests.
- The client-side password gate is a testing deterrent, not a security boundary. It applies only to the deployed host.
- For theme-dependent interactive surfaces, Playwright coverage must exercise the visible state in both light and dark modes.
