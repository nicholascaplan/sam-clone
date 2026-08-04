# Next Steps

Use this file to track unresolved implementation, product and maintenance work. Completed work belongs in `docs/decisions.md`; questions requiring Samantha's input belong in `docs/questions-for-sam.md`.

## Verification And Accessibility

- [ ] **HIGH PRIORITY: Manually verify third-party media on the deployed site.** Check SoundCloud playback events, Spotify and SoundCloud mutual exclusion, soundbar restart and stop controls, soundbar visibility during navigation, and YouTube thumbnail/modal behaviour. Use widget events, not the soundbar alone, to establish that audio is playing.
- [ ] **Align responsive breakpoints.** Reconcile the documented and implemented mobile thresholds, then test desktop, phone landscape, narrow mobile and iframe preview layouts.
- [ ] **Standardise notice and reduced-motion behaviour.** Distinguish informational availability or metadata gaps from errors, and provide reduced-motion alternatives for transitions, playback animation and media hover scaling.
- [ ] **Reduce catalogue maintenance drift.** Keep legacy Listen and Watch source content only while required, and review the rendering path for duplicated metadata, IDs and handlers when that area next changes.

## Deferred Structural Work

- [ ] **Decide whether to move beyond the single-page architecture.** Consider separate URLs such as `/works`, `/listen-watch`, `/writing` and `/contact` only if sharing, search visibility or content growth justifies the extra routing and maintenance complexity.
- [ ] **Plan the new-site migration.** Document cutover, URL and CNAME mappings, redirects, DNS ownership and rollback. Confirm whether GoDaddy manages the domain and DNS.
- [ ] **Evaluate Cloudflare.** Compare its DNS, redirects, caching, security, analytics and traffic-measurement benefits against the current GoDaddy and GitHub Pages setup.

## Constraints And Verification

- The deployed GitHub Pages site has an intentionally insecure client-side password gate. It is a testing deterrent, not a security boundary, and local development remains ungated.
- The visualizer is simulated because the SoundCloud Widget API does not expose audio amplitude. SoundCloud progress comes from the Widget API; Spotify progress is a display-only local elapsed-time estimate. Neither progress bar supports seeking.
- Tailwind is compiled locally to `assets/tailwind.min.css`. Run `npm run build:css` after changing `tailwind.css` or Tailwind utility usage.
- Serve the site over HTTP, not `file://`: `python3 -m http.server 8000`.
- Run `npm test` before deployment. Use `npm run test:all` for the full Chromium, Firefox, WebKit and tagged-mobile matrix.
