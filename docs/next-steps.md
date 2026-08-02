# Next Steps

Use this file as the starting point for a work session. Start with the first unchecked item that has the required input or decision available. Keep it limited to unresolved work; completed implementation details belong in `docs/decisions.md`, `docs/style-guide.md` or `docs/test-strategy.md`.

## 1. Content And Conversion

### Questions For Sam: Works List

The Works cards now use a consistent structure: year, category, duration, title, instrumentation, commission, premiere and optional notes. Please confirm the following before the catalogue is treated as final:

- What is the exact instrumentation for **Formations**?
- Is **Wintering** scored for four solo SATB voices or SATB chorus, alongside string quartet?
- What are the exact strings and percussion in **Breathing Forest**?
- What are the complete scorings for **Breathing Space** and **Echo of a Woman**?
- What are the premiere dates, performers, conductors and venues for works where only partial premiere information is currently recorded?
- Please confirm when **How Many Moments Must**, **Utterance**, **Recollections** and **The Half Moon** were composed and recorded, and identify the performers, ensemble or other recording collaborators for each. For **The Journey Between Us - Reflection 1** (composed 2016), confirm its recording date and collaborators. Add them to the Works List if they are Samantha Fernando compositions.
- What are the original premiere details for **3 Songs for Soprano and Cello**? The 2020 recording details are not necessarily the premiere.
- Is the title **4 Illuminations** or **Four Illuminations**?
- What additional commission, premiere or context should be recorded for **Square of Light**?
- Please confirm the year and premiere details for **Kinesphere**. Current sources conflict between 2013/Purcell Room and 2014/Kings Place.
- Please confirm whether **Current, Rising** should use 2020 as its composition year and 2021 as its premiere year.
- Should **THE EXOPLANETS** be included in the Works List? It appears in the events and source specification but not in the current catalogue.
- Are there any missing awards, texts, recordings or significant collaborators that should appear in the Notes field?

- [ ] **Enable real contact-form delivery.** Sam needs to create a [Formspree](https://formspree.io/) account and provide the form endpoint. Replace the current confirmation-only form behaviour with a real submission, success and error flow.
- [ ] **Remove the bio from the page and add it to a new page.** Confirm the new page location and preserve the approved biography content when moving it.
- [x] **Remove Events and past performances.** Removed the homepage past-performance archive; the Events calendar remains as the current homepage schedule.
- [ ] **Review and refresh dated content.** The listed upcoming events end in March 2026 and the featured writing is dated November 2025. Confirm current events, new works, recordings and writing with Sam before publishing updates.
- [ ] **Add Exoplanets.** Confirm the title, catalogue placement and metadata with Sam, then add it to the appropriate site listings and `docs/content.md`.
- [ ] **Remove full stops from listing copy.** Review repeated listings and catalogue metadata, removing terminal full stops where they are not part of the content itself.

## 2. Resolve Current Design Decisions

- [ ] **Confirm the favicon with Sam.** The site currently uses `assets/new-favicon.png`; confirm that this is the preferred browser-tab and home-screen icon.
- [ ] **Move Listen & Watch to the second menu position.** Confirm the revised navigation order before changing the header and mobile menu.
- [ ] **Review the mobile menu close control.** Assess whether the menu `X` should sit lower on mobile for better reach and visual balance.
- [ ] **Review dark mode top to bottom.** Check the menu, mobile layout, controls, contrast, borders, active states and all content sections for incorrect or inconsistent styling.
- [ ] **Assess a narrower mobile header.** Test whether reducing the header width or horizontal padding improves the mobile layout without compromising title, Composer text or controls.

## 3. Quality And Product Follow-ups

- [ ] **Profile portrait and homepage performance investigation.** Record 3 to 5 uncached Chrome DevTools Performance traces with Screenshots and Web Vitals enabled. Compare median LCP, LCP element and main-thread/network activity before the marker. Use Network request blocking for `w.soundcloud.com`, then `fonts.googleapis.com` and `fonts.gstatic.com`, to isolate third-party media and font impact on the perceived homepage and portrait load delay.
- [ ] **Manually verify third-party media on the deployed site.** Check SoundCloud playback events, Spotify and SoundCloud mutual exclusion, soundbar restart and stop controls, soundbar visibility during navigation, and YouTube thumbnail/modal behaviour. Use widget events, not the soundbar alone, to establish that audio is playing.
- [ ] **Decide whether recordings need an availability indicator.** Add one only if the final catalogue includes a mix of playable and unavailable recordings; otherwise the current playable rows and availability note are sufficient.
- [ ] **Consider a subtle mobile scroll cue on the home page.** Validate that users miss below-the-fold content before adding it.
- [ ] **Review the homepage content mix.** Decide with Sam whether Events and past performances should remain on the homepage or move to dedicated content areas.
- [ ] **Select an upcoming-concert highlight.** Review the three responsive Exoplanets options in `playground.html`, then apply the chosen temporary component to the homepage with confirmed current concert details and a clean post-event removal path.
- [ ] **Resolve component-reference audit findings.** Prioritise keyboard-operable audio rows, complete modal and tab semantics, a shared focus treatment, role-based colour tokens and alignment between documented and implemented responsive breakpoints. Consolidate misleading or duplicated utilities when those areas are next changed.

### Session Verification Notes

- The local Playground now includes a grouped component index with desktop and mobile layouts.
- Inline JavaScript parsing and `git diff --check` passed.
- Playwright browser verification was blocked by the macOS sandbox denying Chromium's rendezvous service. No deployment or published artifact changes were made.
- Event ordering was manually checked in `index.html`; the homepage calendar is descending by event date.

### Component Reference Consistency Registry

Track these findings from the local design-reference audit. The reference page is the visual review surface; this registry is the implementation follow-up.

- [ ] **High: Make audio rows keyboard-operable.** Replace clickable `<div>` rows with buttons or equivalent accessible controls, including clear labels and playing/paused state.
- [x] **Fix light-theme Works view contrast.** Drive the selected and unselected view-button colors from `aria-pressed` so the dynamic state remains WCAG AA compliant in CI.
- [ ] **High: Complete modal semantics.** Add labelled dialog semantics, focus transfer, focus containment, Escape handling and focus restoration to project and video modals.
- [ ] **High: Complete catalogue view semantics.** Consider whether the All Works, Listen and Watch controls should use the ARIA tabs pattern, including `aria-controls`, `role="tabpanel"`, `aria-labelledby` and keyboard arrow/Home/End navigation. Keep the current labelled-button behaviour if the controls remain filter actions rather than tabs.
- [ ] **Medium: Establish a shared focus treatment.** Replace inconsistent border-only focus states and implicit browser defaults with one visible `:focus-visible` token for controls, fields, links and cards.
- [ ] **Medium: Consolidate colour tokens.** Reconcile the configured brand palette, Tailwind amber utilities and hard-coded light-mode overrides into role-based page, panel, surface, ink, muted, accent, action, success and danger tokens.
- [ ] **Medium: Align responsive documentation and implementation.** Resolve the documented `640px` mobile threshold versus the implemented `641px`, `767px` and `768px` breakpoints, then verify desktop, phone landscape, narrow mobile and iframe preview layouts.
- [ ] **Medium: Clarify status semantics.** Standardise neutral availability notices, missing metadata and error states so informational gaps are not presented as failures without a clear reason.
- [ ] **Low: Remove misleading or duplicated styling responsibilities.** Rename or replace the `.font-mono` utility that renders Inter, and consolidate repeated `.glass-panel` border utilities when those components are next refactored.
- [ ] **Low: Add reduced-motion coverage.** Provide reduced-motion behaviour for tab transitions, arrow movement, playback wave animation and media hover scaling.
- [ ] **Low: Reduce media duplication risk.** Continue treating the legacy Watch and Listen sections as source content, but review the catalogue-render path for duplicated metadata, IDs, handlers and future maintenance drift.
- [ ] **Fix mobile back navigation.** Investigate why navigating backwards on mobile can return to a completely different site, and verify history, deep-link and browser-cache behaviour across supported mobile browsers.

## 4. Deferred Structural Work

- [ ] **Decide whether to move beyond the single-page architecture.** Only pursue separate URLs such as `/works`, `/listen-watch`, `/writing` and `/contact` if sharing, search visibility or content growth justifies the added routing and maintenance complexity.
- [ ] **Plan migration to the new site.** Document the future cutover approach, including URL and CNAME mappings, redirects, DNS ownership and rollback. Confirm whether GoDaddy currently manages the domain and DNS.
- [ ] **Evaluate Cloudflare.** Determine whether Cloudflare would provide useful benefits for DNS, redirects, caching, security, analytics or traffic measurement, and compare those benefits with the current GoDaddy and GitHub Pages setup.

## Standing Constraints

- The deployed GitHub Pages site has an intentionally insecure client-side password gate. It is a testing deterrent, not a security boundary, and local development remains ungated.
- The visualizer is simulated because the SoundCloud Widget API does not expose audio amplitude.
- SoundCloud progress comes from the Widget API. Spotify progress is a display-only local elapsed-time estimate; neither progress bar supports seeking.
- Tailwind CDN warnings are expected for this prototype. A local Tailwind build is optional future production hardening.
- The above-the-fold portrait is `assets/sam-1-1200.webp` (`1200 x 800`, about `84 KB`). Add `srcset` only if a separate, higher-resolution desktop source is retained.

## Current Verification Baseline

- Run the site through HTTP, not a `file://` URL: `python3 -m http.server 8000 --directory /Users/nicholascaplan/sam-website`.
- Run `npm test` before deployment. The current Playwright suite covers navigation, catalogue views, filters and search, themes, mobile menu behaviour, mocked Spotify/SoundCloud state transitions, modals, contact confirmation, deep links, deployed-host gate state, keyboard interactions and serious/critical Axe violations across interactive states.
- `npm test` runs the Chromium smoke suite by default; use `npm run test:all` for the full Chromium, Firefox, WebKit and tagged mobile project matrix. The default keeps local verification usable without requiring every Playwright browser binary.
- The latest local `npm test` attempt was blocked before assertions because the sandbox denied Chromium's macOS rendezvous service. Re-run in an unrestricted local or CI environment before deployment.
- Session note, 2026-08-01: Updated the npm scripts so `npm test` targets the locally available Chromium project and `npm run test:all` retains the complete browser matrix. In BoxedCode, Chromium still cannot launch because the sandbox denies `MachPortRendezvousServer`; run `npm test` in an unrestricted terminal or CI environment to complete browser verification.
- Session note, 2026-08-01: Soundbar controls, state lifecycle and layout refinements were checked with `git diff --check` and JavaScript syntax checks. Playwright could not launch Chromium in the BoxedCode sandbox because macOS denied `MachPortRendezvousServer`; rerun `npm test` in the normal local terminal before deployment.
- Session note, 2026-08-01: Provider embed comparison documented. Native SoundCloud embeds can clip long titles and show provider-owned Privacy Policy UI on mobile; those iframe contents cannot be styled by the site. Comparison files are local-only and excluded from the repository and GitHub Pages artifact.
- Session note, 2026-08-01: Spotify listen-page titles now identify extracts, and pausing the shared soundbar preserves the current playback position for resume. Playwright verification remains blocked by the sandbox's macOS Chromium rendezvous permission error; manually verify pause, resume and dedicated stop behavior in an unrestricted local or CI environment.
- Session note, 2026-08-01: Completed Listen catalogue metadata supplied during this session: added three Spotify track titles and durations, added SoundCloud durations, and set The Journey Between Us - Reflection 1 to 2016. Listen-only items needing context are retained in the Sam confirmation task; the three Spotify rows without full details show a red `More Info Needed` label and red missing-year marker.
- Session note, 2026-08-01: All Spotify Listen rows now show a quiet `Extract` status in place of duration because Spotify playback uses 30-second previews. SoundCloud durations remain visible. Live third-party playback still needs manual verification outside the BoxedCode sandbox.
- Session note, 2026-08-01: The legacy Listen source list uses two columns at desktop widths and remains a single column below `768px`. Playback markup is reused by the shared Works & Media catalogue.
- Session note, 2026-08-01: Bracketed recording years in Listen titles now stay attached to the preceding title text when cards wrap, including years added during catalogue initialisation.
- Session note, 2026-08-01: Desktop mobile preview now loads the actual page in a `430px` iframe. The previous `.mobile-preview` class overrides were removed, so the preview and physical mobile devices share the same viewport media queries.
- Session note, 2026-08-01: The local component and design reference passed inline JavaScript syntax, Git exclusion, whitespace and palette contrast checks. Browser interaction and responsive overflow checks remain blocked by the sandbox's macOS Chromium rendezvous permission error and should be completed in an unrestricted local browser before the Sam review.
- Session note, 2026-08-01: Mobile regressions were addressed by restoring real narrow-screen header and portrait constraints, enforcing the dropdown-only Works filter against Tailwind's display utilities, and making the iframe preview scrollbar-free with an external close control. The mobile hero was compacted so its italic introduction fits within a 390 x 844 viewport. Run `npm test` and manually inspect the preview scrollbar, mobile filter and hero in an unrestricted browser before deployment.
- Session note, 2026-08-01: The mobile preview shell now uses explicit border-box sizing and clips iframe overflow so the header aligns with the device frame. The mobile header-height assertion was corrected to account for its border. Deployment was requested, but the BoxedCode sandbox currently blocks shell/git commands because `rg` is unavailable; no commit or push was performed.
- Session note, 2026-08-01: Implemented the selected Works & Media direction: one catalogue and two purposeful nav entry points, with Works List opening All Works and Listen & Watch opening Listen. Watch is a sibling filter with a shareable `#watch` deep link. Hosted media actions use the selected fine-outline treatment and anchor to the bottom of their rows. Static JavaScript, whitespace and Git-exclusion checks pass; browser interaction verification remains blocked by the sandbox's Chromium rendezvous permission error.
- Session note, 2026-08-01: Fixed the mobile menu regression caused by a broad `header > div` mobile height rule also constraining the drawer. Header sizing is now scoped to the header row, the menu expands naturally without scrolling, and the smoke test compares mobile menu item count with primary navigation item count. Browser verification remains blocked by the sandbox's Chromium macOS rendezvous permission error.
- Session note, 2026-08-01: The suite now uses mocked Spotify and SoundCloud APIs for deterministic playback-state coverage, tests the deployed-host password gate without duplicating its credential, checks interactive accessibility states, and runs desktop projects for Chromium, Firefox and WebKit plus tagged mobile Chromium checks. Browser execution remains subject to local and CI browser availability.
- Session note, 2026-08-01: The expanded `npm test` run was blocked before application assertions: the BoxedCode sandbox denied Chromium's macOS rendezvous service, and the local Playwright Firefox and WebKit executables are absent. Static JavaScript checks, whitespace checks and test discovery pass. Run `npx playwright install` in an unrestricted environment before the cross-browser suite.
- Session note, 2026-08-01: The shared Works & Media catalogue test changes pass `git diff --check` and Playwright discovery (103 tests). The full suite remains unverified in BoxedCode: Chromium cannot launch in the sandbox, and Firefox fails before the first assertion because its browser context is unavailable. Re-run `npm test` in an unrestricted local terminal or CI before deployment.
- Session note, 2026-08-01: Fixed SoundCloud paused-state labelling and light-mode contrast failures for Works metadata, missing-recording notices and Spotify `Extract` labels. Static JavaScript, whitespace and diff checks pass. Re-run the Axe suite in an unrestricted browser environment to confirm all interactive-state contrast results.
- Session note, 2026-08-01: Follow-up browser results identified contrast failures on active/inactive Works view buttons and a WebKit modal focus-restoration timing issue. Darker light-mode Works view tokens and deferred modal focus restoration were added. Re-run the affected Axe and modal tests in the normal browser environment.
- Session note, 2026-08-02: Updated shared Works & Media tests to avoid browser-normalised CSS assertions, use exact accessible navigation locators and assert filtered card outcomes. Instrumentation options now use explicit `data-category` values for reliable state updates. Static checks pass; targeted browser execution remains blocked by the sandbox Chromium launch restriction.
- Session note, 2026-08-02: Reduced Playwright coupling to catalogue counts, video IDs, long copy, DOM control totals, CSS layout values and exact provider call order. The shared media workflow is split into smaller filtering and view-switching tests, while desktop projects exclude `@mobile` tests.
- Session note, 2026-08-02: Corrected the `KXrYuIWLv60` Watch entry to Current, Rising - Official Trailer after confirming the video content. Added Wintering - Film Trailer using the provided `5BApW0VSCes` URL. The Watch catalogue now contains eight YouTube films; thumbnail-title pairings are covered in the shared catalogue test. `git diff --check`, test syntax and Playwright discovery pass. Full browser execution remains blocked in BoxedCode, so run `npm test` in an unrestricted terminal or CI before deployment.
- Session note, 2026-08-02: Replaced the Watch catalogue with the supplied ten-video YouTube catalogue, adding both `glass human` videos and `Samantha Fernando: Pathways` and removing `4 Klee Miniatures` from the Watch view. Updated the source content record and README count. `git diff --check` and inline JavaScript syntax pass. `npm test` remains blocked before assertions because the BoxedCode sandbox denies Chromium's macOS rendezvous service; rerun it in an unrestricted terminal or CI before deployment.
- Session note, 2026-08-02: Refined Playwright assertions after browser feedback so they target current UI semantics rather than stale names, hidden controls or assumed card-level media actions. Desktop test projects exclude `@mobile` cases. `git diff --check` and test/config syntax checks pass; run `npm test` in an unrestricted terminal or CI before deployment.
- Session note, 2026-08-02: Diagnosed the GitHub Actions Axe failure as light-theme contrast on the dynamically selected Works view buttons. Updated their colors to follow `aria-pressed`, recorded the fix in the component registry, and passed `git diff --check`. The final browser run remains to be confirmed in an unrestricted environment.
- Session note, 2026-08-02: Removed the homepage Past Performances archive and removed the four outdated works requested by Sam: Glimmer, Shadows on Shadows, Change and War Without End. Static reference and whitespace checks pass. Browser verification remains blocked by the BoxedCode sandbox's Chromium macOS rendezvous permission error.
