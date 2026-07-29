# Next Steps

## Content

- Confirm whether Sam wants the Aaron album songs available to listen.
- Obtain confirmed SoundCloud iframe code or track IDs for `Everything Passes, Everything is Connected` and `Have It All`.
- Add confirmed sources to the `soundcloudTracks` map and update the corresponding Listen rows.
- Keep `Balconies` on Spotify. `3 Songs for Soprano and Cello` was removed because it does not exist.

## Verification

- Test each recording through `http://localhost:8000`, not by opening `index.html` with a `file://` URL.
- Confirm SoundCloud `PLAY`, `PAUSE`, and `FINISH` events update the row icon and soundbar correctly.
- Do not treat a generic soundbar message as proof that audio is playing; use widget events.

## Known Constraints

- The client-side password gate is intentionally insecure and is only a testing deterrent.
- The visualizer is simulated because SoundCloud does not expose audio amplitude through its Widget API.
- The contact form is local-only and does not send email without a backend or form-service integration.
- Tailwind CDN warnings are expected for this prototype; production could build Tailwind locally.
