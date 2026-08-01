# Next Steps

Use this file as the starting point for a work session. Start with the first unchecked item that has the required input or decision available. Keep it limited to unresolved work; completed implementation details belong in `docs/decisions.md`, `docs/style-guide.md` or `docs/test-strategy.md`.

## 1. Content And Conversion

### Questions For Sam: Works List

The Works cards now use a consistent structure: year, category, duration, title, instrumentation, commission, premiere and optional notes. Please confirm the following before the catalogue is treated as final:

- What is the exact instrumentation for **Formations**?
- Is **Wintering** scored for four solo SATB voices or SATB chorus, alongside string quartet?
- What are the exact strings and percussion in **Breathing Forest**?
- What are the complete scorings for **Breathing Space**, **Echo of a Woman** and **Glimmer**?
- What are the premiere dates, performers, conductors and venues for works where only partial premiere information is currently recorded?
- What are the original premiere details for **3 Songs for Soprano and Cello**? The 2020 recording details are not necessarily the premiere.
- What additional commission, premiere or context should be recorded for **Square of Light**?
- Please confirm the year and premiere details for **Kinesphere**. Current sources conflict between 2013/Purcell Room and 2014/Kings Place.
- Please confirm whether **Current, Rising** should use 2020 as its composition year and 2021 as its premiere year.
- Should **THE EXOPLANETS** be included in the Works List? It appears in the events and source specification but not in the current catalogue.
- Are there any missing awards, texts, recordings or significant collaborators that should appear in the Notes field?

- [ ] **Enable real contact-form delivery.** Sam needs to create a [Formspree](https://formspree.io/) account and provide the form endpoint. Replace the current confirmation-only form behaviour with a real submission, success and error flow.
- [ ] **Confirm public access to Aaron album recordings.** If approved, add the supplied playable links and update `docs/content.md`.
- [ ] **Gather the remaining Spotify and SoundCloud songs.** Confirm the complete recording list and add any missing tracks, metadata and playable links to `docs/content.md`.
- [ ] **Decide the final Spotify embed treatment.** The compact Spotify iframe is available in `spotify-embed-preview.html`; compare its space, authentication and playback behaviour with the existing custom SoundCloud row before replacing the live Spotify controller.
- [ ] **Review and refresh dated content.** The listed upcoming events end in March 2026 and the featured writing is dated November 2025. Confirm current events, new works, recordings and writing with Sam before publishing updates.

## 2. Resolve Current Design Decisions

- [ ] **Add play buttons to Works items.** Add a clear play control to Works entries that have playable audio or video, reusing the existing playback and modal behaviour.
- [ ] **Consider filters on the Listen & Watch page.** Assess whether filters by recording type, ensemble, year or other catalogue metadata would help visitors browse the combined media collection as it grows.
- [ ] **Confirm the favicon with Sam.** The site currently uses `assets/new-favicon.png`; confirm that this is the preferred browser-tab and home-screen icon.

## 3. Quality And Product Follow-ups

- [ ] **Profile portrait and homepage performance investigation.** Record 3 to 5 uncached Chrome DevTools Performance traces with Screenshots and Web Vitals enabled. Compare median LCP, LCP element and main-thread/network activity before the marker. Use Network request blocking for `w.soundcloud.com`, then `fonts.googleapis.com` and `fonts.gstatic.com`, to isolate third-party media and font impact on the perceived homepage and portrait load delay.
- [ ] **Manually verify third-party media on the deployed site.** Check SoundCloud playback events, Spotify and SoundCloud mutual exclusion, soundbar restart and stop controls, soundbar visibility during navigation, and YouTube thumbnail/modal behaviour. Use widget events, not the soundbar alone, to establish that audio is playing.
- [ ] **Add mocked playback-state tests when media behaviour changes.** Cover SoundCloud `PLAY`, `PAUSE` and `FINISH` events plus Spotify/SoundCloud hand-off without calling live providers. Keep the existing Playwright suite focused on local smoke coverage.
- [ ] **Decide whether recordings need an availability indicator.** Add one only if the final catalogue includes a mix of playable and unavailable recordings; otherwise the current playable rows and availability note are sufficient.
- [ ] **Consider a subtle mobile scroll cue on the home page.** Validate that users miss below-the-fold content before adding it.

## 4. Deferred Structural Work

- [ ] **Decide whether to move beyond the single-page architecture.** Only pursue separate URLs such as `/works`, `/listen-watch`, `/writing` and `/contact` if sharing, search visibility or content growth justifies the added routing and maintenance complexity.

## Standing Constraints

- The deployed GitHub Pages site has an intentionally insecure client-side password gate. It is a testing deterrent, not a security boundary, and local development remains ungated.
- The visualizer is simulated because the SoundCloud Widget API does not expose audio amplitude.
- SoundCloud progress comes from the Widget API. Spotify progress is a display-only local elapsed-time estimate; neither progress bar supports seeking.
- Tailwind CDN warnings are expected for this prototype. A local Tailwind build is optional future production hardening.
- The above-the-fold portrait is `assets/sam-1-1200.webp` (`1200 x 800`, about `84 KB`). Add `srcset` only if a separate, higher-resolution desktop source is retained.

## Current Verification Baseline

- Run the site through HTTP, not a `file://` URL: `python3 -m http.server 8000 --directory /Users/nicholascaplan/sam-website`.
- Run `npm test` before deployment. The current Playwright suite covers navigation, filters and search, themes, mobile menu behaviour, Listen & Watch tabs, modals, score-request prefill, contact confirmation, deep links and serious/critical homepage accessibility violations.
- The latest local `npm test` attempt was blocked before assertions because the sandbox denied Chromium's macOS rendezvous service. Re-run in an unrestricted local or CI environment before deployment.
- Session note, 2026-08-01: Soundbar controls, state lifecycle and layout refinements were checked with `git diff --check` and JavaScript syntax checks. Playwright could not launch Chromium in the BoxedCode sandbox because macOS denied `MachPortRendezvousServer`; rerun `npm test` in the normal local terminal before deployment.
- Session note, 2026-08-01: Provider embed comparison documented. Native SoundCloud embeds can clip long titles and show provider-owned Privacy Policy UI on mobile; those iframe contents cannot be styled by the site. The compact mixed-provider preview is in `spotify-embed-preview.html`; it is excluded from the GitHub Pages artifact by the deployment workflow.
