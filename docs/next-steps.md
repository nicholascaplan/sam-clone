# Next Steps

Use this file to track unresolved implementation, product and maintenance work. Completed work belongs in `docs/decisions.md`; questions requiring Samantha's input belong in `docs/questions-for-sam.md`.

## Verification And Accessibility

- [ ] **HIGH PRIORITY: Manually verify third-party media on the deployed site.** Check SoundCloud playback events, Spotify and SoundCloud mutual exclusion, soundbar restart and stop controls, soundbar visibility during navigation, and YouTube thumbnail/modal behaviour. Use widget events, not the soundbar alone, to establish that audio is playing.
- [ ] **Align responsive breakpoints.** Reconcile the documented and implemented mobile thresholds, then test desktop, phone landscape, narrow mobile and iframe preview layouts.
- [ ] **Standardise notice and reduced-motion behaviour.** Distinguish informational availability or metadata gaps from errors, and provide reduced-motion alternatives for transitions, playback animation and media hover scaling.

## Mobile Preview Performance

- [ ] **Instrument cold and warm preview startup.** Record iframe navigation, DOM readiness, first paint, route readiness and load completion, then inspect the request waterfall to identify what accounts for the current first-open delay before making further optimisations.
- [ ] **Create a lightweight preview boot profile.** Keep the real page and responsive CSS, but use the `mobilePreview` flag to avoid initializing media providers, hidden modals, inactive catalogue views and other functionality that is not needed until it is used.
- [ ] **Reduce render-blocking external assets.** Measure Google Fonts and Font Awesome in the preview critical path; evaluate self-hosted/subset fonts and inline SVG icons so first render does not depend on third-party stylesheet requests.
- [ ] **Render only the active route initially.** Avoid building or decoding content for hidden tabs during preview startup, then initialize a route when the visitor navigates to it inside the iframe.
- [ ] **Audit preview image delivery.** Add appropriately sized `srcset` candidates, preserve lazy loading for inactive content and ensure only the visible route's critical image receives high priority.
- [ ] **Add an explicit preview-ready handshake.** Have the iframe notify the parent when its current route is rendered, show a lightweight loading state until then and distinguish navigation readiness from slow non-critical resources.
- [ ] **Add mobile-preview regression and performance coverage.** Verify first open, repeated open/close reuse, current-route synchronization, refresh restoration, recursion prevention and a bounded set of preview startup requests. Capture timing as diagnostic output before enforcing a stable performance budget.
- [ ] **Reconsider the iframe architecture if boot profiling remains slow.** Compare the retained real-page iframe with a same-document responsive preview or dedicated preview entry point, documenting state-sync, accessibility and maintenance trade-offs before changing the current architecture decision.

## Deferred Structural Work

- [ ] **Plan the new-site migration.** Document cutover, URL and CNAME mappings, redirects, DNS ownership and rollback. Confirm whether GoDaddy manages the domain and DNS.
- [ ] **Evaluate Cloudflare.** Compare its DNS, redirects, caching, security, analytics and traffic-measurement benefits against the current GoDaddy and GitHub Pages setup.

## Constraints And Verification

- The deployed GitHub Pages site has an intentionally insecure client-side password gate. It is a testing deterrent, not a security boundary, and local development remains ungated.
- The visualizer is simulated because the SoundCloud Widget API does not expose audio amplitude. SoundCloud progress comes from the Widget API; Spotify progress is a display-only local elapsed-time estimate. Neither progress bar supports seeking.
- Tailwind is compiled locally to `assets/tailwind.min.css`. Run `npm run build:css` after changing `tailwind.css` or Tailwind utility usage.
- Serve the site over HTTP, not `file://`: `python3 -m http.server 8000`.
- Run `npm test` before deployment. Use `npm run test:all` for the full Chromium, Firefox, WebKit and tagged-mobile matrix.
