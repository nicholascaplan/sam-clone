# Decisions

Short record of settled product, content and implementation decisions for the site.

### Keep event listings newest first

- Decision: Display the homepage event calendar and event source listings in descending date order, with the most recent event first.
- Reason: Visitors can see the latest event immediately, and the shared ordering convention keeps the homepage and content records aligned.

## 2026-08-02

### Reset Works & Media filters between views

- Decision: Clear the shared search and Instrumentation filters whenever a visitor moves between the Works, Listen and Watch views. Keep the filters unchanged when the current view is re-rendered without changing views.
- Reason: Each view is a distinct entry point into the catalogue, so stale criteria should not silently hide its content. Resetting on view changes gives every tab a predictable default while preserving normal filtering within that tab.

### Keep Biography in the single-page shell

- Decision: Keep Biography in `index.html` as the `#bio` route. The root route retains the quote-led homepage and Spotlight Works. The `#bio` route presents the full profile copy with supporting portrait, milestones, education and fellowship.
- Reason: The shared document preserves one header, theme, playback state, mobile preview and navigation implementation across all current site destinations.

### Do not add standalone pages before a planned architecture split

- Decision: New destinations must use `index.html` in-page routes until a documented site-architecture split is approved. Do not create additional public HTML pages as an incremental navigation change.
- Reason: A standalone page duplicates header, theme, playback, mobile-preview and routing behaviour, creating avoidable inconsistencies and regressions.

### Preserve browser history between site sections

- Decision: Push a browser-history entry for each deliberate section or Works & Media view change, then restore the matching view when the browser emits `popstate`.
- Reason: Back and Forward should move through the visitor's previous places within the single-page site before leaving it. Fragments remain the shareable canonical URLs without requiring a multi-page migration.

### Compact parallel work media actions

- Decision: Use one shared button width sized for the longest action label. Stack multiple media actions vertically on desktop, but place two actions in an equal-width row on mobile when they fit. Use the play icon for both audio and video, with specific text labels such as `Listen`, `Trailer`, `Performance` and `Insights` identifying the media.
- Reason: Consistent button footprints make single- and multi-action cards easier to scan, while the mobile row reduces card height and keeps parallel actions visible together. The play icon communicates the action more directly than a film strip, while the visible label provides the necessary media context.

## 2026-08-01

### Unify Works and media in one catalogue

- Decision: Use one Works & Media catalogue. Keep `Works List` and `Listen & Watch` as separate navigation labels: Works List opens All Works, Listen & Watch opens the Listen filter, and Watch is a sibling filter. Render fine-outline rectangular Listen and Watch actions only for works with hosted media.
- Reason: The single catalogue removes duplicated listing and filtering logic while retaining familiar, purposeful entry points. It makes recordings and films discoverable from their related work without implying that every work has an online recording. The selected action style stays consistent for parallel media actions and matches other labelled rectangular controls on the site.

### Use editorial cards for Watch

- Decision: Keep the shared Works and Listen compact catalogue cards, but render Watch as two-column YouTube thumbnail cards that open the existing in-page modal.
- Reason: Video imagery and descriptive context give films a materially stronger presentation than a compact media row, while the shared search, Instrumentation filter, deep links and modal playback preserve the unified catalogue behaviour.

### Test provider integrations through controlled browser doubles

- Decision: Exercise Spotify and SoundCloud playback with browser-level doubles for their APIs, while retaining local smoke coverage for the rest of the page.
- Reason: Provider availability and timing should not make CI non-deterministic. The doubles verify selected-track loading, provider hand-off, queued SoundCloud readiness, pause and finish behaviour without live network dependencies.

### Test the deployed password-gate condition without spreading its credential

- Decision: Map the published hostname to the local Playwright server in Chromium, test the locked state, rejection, password visibility and persisted session unlock, and do not submit the checked-in credential from the test suite.
- Reason: This exercises the hostname-specific gate while avoiding an additional copy of a deliberately insecure credential in test code or logs.

### Treat real mobile CSS as the responsive source of truth

- Decision: Keep all narrow-screen layout constraints, including the compact header and 13rem hero portrait, in `@media (max-width: 767px)` rules. The desktop mobile-preview iframe must exercise those same rules rather than supply its own layout overrides.
- Reason: The iframe correctly exposed that preview-only constraints had been deleted during the preview refactor, leaving real phones without their portrait, title and control sizing rules. Playwright now verifies the portrait height, visible menu control and mobile-only Works dropdown at a 390px viewport.

### Keep the complete mobile hero introduction above the fold

- Decision: At phone widths, use a 4rem header, 13rem portrait and reduced hero spacing so the italic biography introduction is fully visible in a 390 x 844 viewport.
- Reason: The homepage should introduce Samantha and her artistic context without requiring a scroll past disproportionate whitespace or controls.

### Use a real viewport for desktop mobile preview

- Decision: Render desktop mobile preview in a `430px` iframe of the actual page instead of applying a `.mobile-preview` class and duplicating responsive overrides.
- Reason: CSS media queries evaluate the browser viewport, not a visually narrowed body. A real narrow iframe makes the preview use exactly the same responsive rules as a mobile browser and prevents future layout drift. The preview query parameter only hides the scrolling document's scrollbar and never changes page layout; the close button remains outside the simulated device.

### Keep component styling experiments in a local playground

- Decision: Use `playground.html` as the local-only space for comparing style options for site components.
- Reason: It supports visual iteration without adding experimental variants to the deployed website. The file is intentionally untracked and is not included in the GitHub Pages artifact.

### Maintain a separate local design reference

- Decision: Use the Git-excluded `design-reference.html` as the maintained inventory of accepted foundations, components and states. Keep `playground.html` for temporary option comparisons.
- Reason: Separating the accepted reference from experiments gives Sam a stable review page without adding local tooling or exposing maintenance material in the published site.

### Add a component index to the local playground

- Decision: Use a sticky left-hand component index on desktop, with a horizontally scrollable compact version on mobile. Group links by Highlights, Catalogue and Homepage, and anchor them to the relevant comparison sections.
- Reason: The Playground contains several independent design explorations. A persistent index makes the scope of each option clear and lets reviewers move directly to a component without adding navigation to the published site.

### Use a desktop-only two-column audio catalogue

- Decision: Display the Listen catalogue as two equal columns from `768px` upward, while retaining the single-column list on mobile and in the iframe mobile preview.
- Reason: This makes better use of wide screens without separating title and supporting metadata into artificial columns or changing the existing playback rows.

### Use a wide-screen three-column Watch catalogue

- Decision: Keep Works and Listen at two columns, and add a third Watch column from `1280px` upward. Use a shared grid gap for the catalogue so cards in the same row align without child-specific top margins.
- Reason: Watch cards are image-led and remain readable at the wider breakpoint, while three columns at ordinary laptop widths would make the editorial thumbnails and descriptions too narrow. Removing the inherited vertical spacing utility fixes the visible stagger between cards.

### Avoid redundant Watch metadata

- Decision: Show only the year in Watch card metadata; do not repeat `Film` because every item in the Watch view is already a film.
- Reason: The view context already communicates the media type, so the repeated label adds visual noise without useful information.

### Keep recording years attached to titles

- Decision: Use a non-breaking space before bracketed recording years so a year such as `[2021]` stays with the preceding title text when the title wraps.
- Reason: This keeps title metadata readable on narrow audio cards without preventing normal wrapping earlier in the title.

### Mark Spotify previews in the top metadata line

- Decision: Display `30 sec preview` as a quiet top metadata label after `Recording` in Spotify Listen cards. Do not display the provider name in the card.
- Reason: This matches the live catalogue card hierarchy, accurately sets expectations before playback and keeps the work title and Listen action unchanged.

### Keep provider-native embeds out of the compact mixed media rows

- Finding: Spotify's compact iframe is substantially taller than the custom track row. SoundCloud's native iframe also injects provider-owned UI, including a Privacy Policy control, and can clip or obscure long titles on narrow mobile widths. Cross-origin iframe content cannot be restyled by the site.
- Decision: Keep the existing custom SoundCloud row and hidden Widget API player for the live compact catalogue. Treat a visible Spotify iframe as a separate preview/integration option until its space and playback behaviour are accepted. Any comparison files remain local-only and are not part of the repository or published artifact.
- Reason: This preserves readable titles, consistent controls and predictable mobile density. Native embeds remain useful for evaluation, but their internal layout and provider UI are not controllable by the site.

## 2026-07-31

### Standardise Works card metadata

- Decision: Use the pill only for a controlled work category. Render year, duration, title, instrumentation, commission, premiere and optional notes in consistent positions on every card.
- Reason: The previous pill mixed categories, ensembles, venues, awards and recording labels, making cards visually inconsistent and the metadata difficult to compare.

### Use a category dropdown for mobile Works filters

- Decision: Replace the desktop category button row with a single labelled dropdown on mobile while retaining the search field and desktop buttons.
- Reason: The dropdown preserves every category while exposing the Works catalogue much earlier in the mobile viewport. Keep the mobile toolbar stacked rather than side by side so the search field and long category names remain usable.

### Keep the mobile Works toolbar compact

- Decision: Use a shorter mobile description and search placeholder, hide the visible category label while retaining its accessible label, remove the divider and reduce control height and vertical spacing.
- Reason: Recover vertical space for the Works catalogue without removing either filter.

### Use compact editorial home page links

- Decision: Use quiet stacked hero links with fine dividers, compact circular icons, readable labels and fine directional arrows. Keep the rows full width on desktop and mobile, with Listen first.
- Reason: The lower visual weight better supports the editorial character of the homepage while preserving clear destinations and comfortable tap targets.

### Place home page actions after the quote

- Decision: Position the home page actions immediately after the hero quote and before the introductory biography copy.
- Reason: This keeps the artistic statement first while presenting all primary destinations before a visitor needs to read or scroll through the longer introduction.

## 2026-07-30

### Superseded: use a combined Listen & Watch media page

- Superseded by the 2026-08-01 unified Works & Media catalogue decision. The navigation label remains, but it opens the Listen filter rather than a separate tabbed page.

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
