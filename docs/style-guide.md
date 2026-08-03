# Style Guide

## Visual Direction

- Keep the site editorial, calm, spacious, and human.
- Treat it as a contemporary composer portfolio, not a developer dashboard.
- Use Newsreader/Cinzel for display and editorial text, with Inter for controls and metadata.
- Do not use monospace or fixed-width typography for visible navigation, headings, buttons, or content labels.
- Avoid visible technical section numbering.

## Visual References

- Christian Mason: <https://www.christianmason.net/>
- Gavin Higgins: <https://www.gavinhiggins.com/>
- Manchester Collective: <https://manchestercollective.co.uk/>
- Tonia Ko: <https://toniako.com/>

## Colour And Contrast

- Light mode is the default.
- Use muted, readable amber/brown accents in light mode.
- Keep warning and information panels readable with dark text on restrained pale backgrounds.
- Controls should use translucent neutral surfaces and visible borders rather than solid black.
- Check text, icon, border, and hover contrast against the actual background.

## Layout And Spacing

- Keep related cards equal in width and align their internal content.
- Use explicit gaps between stacked panels, cards, and actions.
- Do not let hover, playback state, tooltips, or changing labels alter surrounding layout.
- Keep repeated controls a consistent size.
- Homepage destination links should use quiet full-width rows with consistent dividers, compact icons, readable labels and fine directional arrows.
- Homepage destination rows should retain comfortable tap targets at every viewport width.

## Responsive Behaviour

- Real mobile layouts activate automatically at viewport widths of `640px` or less.
- The mobile preview button loads the actual page in a centered `430px` iframe so normal viewport media queries apply.
- Do not add `.mobile-preview` responsive overrides. Real narrow-screen media queries are the single source of truth for mobile and preview layouts.
- On mobile, keep the site title on one line, place Composer below it, and keep header controls inside the viewport.
- Keep destinations in the shared `index.html` shell until a planned architecture split is approved. This preserves the same header utilities and behaviour: theme, desktop mobile preview, Listen and mobile navigation.
- Reduce the hero portrait height and hide secondary credential cards when necessary to expose the main content and CTAs.
- The mobile menu must open below the header and remain visible above page content.
- Test narrow widths, phone landscape, desktop, and resizing between breakpoints.
- Stack mobile bio CTAs at full width so their icons and labels remain comfortably spaced.
- Use one shared site-styled Instrumentation menu beside the Works & Media search field on desktop, stacking them on mobile. Keep both controls available in Works, Listen and Watch views; avoid a native select popup because browser styling is inconsistent.
- Separate the Works, Listen and Watch controls from the shared search and Instrumentation toolbar with a fine divider.
- Reset the shared search and Instrumentation filters when moving between Works, Listen and Watch; preserve them while re-rendering the current view.
- Render Works and Listen catalogue cards in two columns from `768px` upward. Render Watch cards in two columns from `768px` and three columns from `1280px` upward. Keep a single column below `768px`, use one grid gap rather than stacked-child margins and allow card metadata to wrap rather than overflow.
- Use the `SF` monogram for the browser favicon and mobile home-screen icon. Serve dedicated `96px` and `180px` PNG variants rather than the high-resolution source artwork.

## Interaction And Audio

- Use a moon icon in light mode and a sun icon in dark mode.
- Keep the Listen label stable and show play/pause state with a small icon.
- The Soundscape control must have an accessible label.
- SoundCloud playback state must be driven by Widget API events, not assumed from calls to `play()` or `pause()`.
- Keep the SoundCloud iframe in the document and visually hidden; `display: none` can prevent initialisation.
- Initialise visually hidden SoundCloud Widget API players after the page load in idle time. Queue an early track tap until the player is ready without changing the UI.
- Spotify recordings use custom listing rows backed by the Spotify IFrame API.
- Spotify and SoundCloud playback must be mutually exclusive.
- Show a consistent fine-outline rectangular action for every hosted `Listen` or `Watch` item. Use one shared button width sized for the longest action label. Stack multiple actions vertically on desktop; place them in an equal-width row on mobile when two buttons fit. Use a play icon for both audio and video actions, relying on the action label to identify the media. Do not render an action for a work without hosted media.
- Align a single compact catalogue action to the card's reading edge on mobile. Retain its right alignment on desktop.
- Keep provider icons in the top-right of legacy audio rows. SoundCloud durations remain in the bottom-right of those rows. In the shared Listen catalogue, show the related Work's category pill and track time when known. Spotify actions read `Preview`; SoundCloud actions read `Listen`. Do not display provider names or redundant recording labels.
- The visualizer is simulated because SoundCloud does not expose audio amplitude through its Widget API.

## Images And Performance

- Preload the above-the-fold portrait and mark it high priority.
- Use eager loading for the landing portrait and lazy loading for below-the-fold images/embeds.
- Use `assets/sam-1-1200.webp` for the above-the-fold portrait and preload; add responsive `srcset` if a separate desktop source is introduced.
- Do not load third-party playback APIs until a visitor requests playback. Hidden or non-home route images must use lazy loading.
- Ship precompiled utility CSS in `assets/tailwind.min.css`; do not load Tailwind's browser-side CDN compiler on the public site.

## Accessibility And Content

- Use British English throughout site copy.
- Do not use em dashes in site copy.
- Do not use Oxford commas in site copy.
- Provide meaningful image alt text and accessible labels for icon-only controls.
- Keep focus states visible.
- Use buttons for actions and links for navigation.
- Keep explanatory notices after the primary action they qualify.
- Do not add top-level navigation items without approval.
- Embedded YouTube videos should open in an in-page modal.
- `Works List`, `Listen` and `Watch` are separate navigation entry points into the same Works & Media catalogue. They open All Works, Listen and Watch respectively.
- Watch cards should contain actual YouTube videos only; project-information cards belong in project or biography content.
- Keep Works and Listen in the shared compact catalogue-card treatment. Render Watch as editorial YouTube thumbnail cards with the year as the only metadata label, opening the existing modal only after user interaction.
- The soundbar should remain visible while a track is playing or paused, including after navigation. It has persistent restart and stop controls; navigating away after a stop clears the stopped playback state and hides the soundbar.
- The soundbar progress display is informational only and must not imply that either provider supports seeking. SoundCloud position comes from the Widget API; Spotify uses a local elapsed-time estimate.
- Load SoundCloud progress metadata when playback starts, not only from recording-list clicks, so the header Listen control also shows active progress.
- Queue a SoundCloud play request made before its Widget API `READY` event and start it once the player becomes ready.
- The header Listen control and soundbar pause control must share the same provider-aware playback toggle so both can pause or resume SoundCloud and Spotify.
- Selecting a different recording starts it from the beginning. Selecting the currently playing recording pauses it.
