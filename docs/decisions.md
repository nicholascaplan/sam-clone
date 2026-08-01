# Decisions

Short record of settled product, content and implementation decisions for the site.

## 2026-08-01

### Keep provider-native embeds out of the compact mixed media rows

- Finding: Spotify's compact iframe is substantially taller than the custom track row. SoundCloud's native iframe also injects provider-owned UI, including a Privacy Policy control, and can clip or obscure long titles on narrow mobile widths. Cross-origin iframe content cannot be restyled by the site.
- Decision: Keep the existing custom SoundCloud row and hidden Widget API player for the live compact catalogue. Treat the visible Spotify iframe as a separate preview/integration option until its space and playback behaviour are accepted. The standalone `spotify-embed-preview.html` documents the compact Spotify/SoundCloud comparison and mixed-provider layout without changing the published artifact.
- Reason: This preserves readable titles, consistent controls and predictable mobile density. Native embeds remain useful for evaluation, but their internal layout and provider UI are not controllable by the site.

## 2026-07-31

### Standardise Works card metadata

- Decision: Use the pill only for a controlled work category. Render year, duration, title, instrumentation, commission, premiere and optional notes in consistent positions on every card.
- Reason: The previous pill mixed categories, ensembles, venues, awards and recording labels, making cards visually inconsistent and the metadata difficult to compare.

### Use a category dropdown for mobile Works filters

- Decision: Replace the desktop category button row with a single labelled dropdown on mobile while retaining the search field and desktop buttons.
- Reason: The dropdown preserves every category while exposing the Works catalogue much earlier in the mobile viewport. Keep the mobile toolbar stacked rather than side by side so the search field and long category names remain usable.

### Keep the mobile Works toolbar compact

- Decision: Use a shorter mobile description and search placeholder, hide the visible category label while retaining its accessible label, remove the divider and reduce control height and vertical spacing. Desktop mobile-preview mode must match the real narrow-screen treatment.
- Reason: Recover vertical space for the Works catalogue without removing either filter.

### Use gallery-style home page actions

- Decision: Use warm, tactile hero actions with compact, optically balanced circular icons, readable labels, directional arrows and a softly highlighted Listen action first. Keep them in one row on desktop and stack them on mobile.
- Reason: The additional detail creates a more polished, distinctive treatment while preserving clear hierarchy and comfortable tap targets.

### Place home page actions after the quote

- Decision: Position the home page actions immediately after the hero quote and before the introductory biography copy.
- Reason: This keeps the artistic statement first while presenting all primary destinations before a visitor needs to read or scroll through the longer introduction.

## 2026-07-30

### Use a combined Listen & Watch media page

- Decision: Expose `Listen & Watch` as the public media page, with Listen before Watch in internal tabs.
- Reason: Keep recordings and performance films together without adding separate top-level navigation items.

### Keep the homepage URL free of `#bio`

- Decision: The homepage uses the clean URL without a redundant `#bio` anchor. Hashes are reserved for deep links to other sections.
- Reason: The default page state does not need a fragment, while section links remain shareable.

### Use a lightweight WebP hero portrait

- Decision: Use `assets/sam-1-1200.webp` for the above-the-fold portrait and preload it at high priority.
- Reason: The `1200 x 800` image is approximately `84 KB`, substantially smaller than the previous portrait source while retaining sufficient resolution for the displayed size.

### Defer SoundCloud player initialisation

- Decision: Create the hidden SoundCloud player iframes and load the Widget API after the page `load` event, during idle time. Queue playback requests made before initialisation completes.
- Reason: The homepage portrait and primary content can paint without three third-party player documents competing for network and main-thread work, while Listen remains functional if used immediately.

### Keep the soundbar visible during navigation

- Decision: Keep the soundbar visible when users move between site sections while a track is selected or playback is being initialised.
- Reason: Navigation should not discard the user's audio context or hide feedback from a Listen action that is still waiting for the external player API.

### Use neutral editorial treatment for notices

- Decision: Style recording availability as a neutral note rather than a warning panel.
- Reason: Avoid implying an error or alert where the content is informational.

### Keep the client-side password gate

- Decision: Retain the intentionally insecure password gate on the deployed GitHub Pages host.
- Reason: It is a testing deterrent, not a security boundary, and is not required during local development.
