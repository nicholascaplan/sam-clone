# Next Steps

## Content

- Review the combined `Listen & Watch` page and decide whether its internal Listen and Watch tabs should remain the permanent media experience.
- Confirm whether Sam wants the Aaron album songs available to listen.
- Keep the confirmed Spotify rows for `Balconies`, `Kinesphere`, and `Everything Passes, Everything is Connected`.
- Keep `Kinesphere` sourced from Spotify rather than the duplicate SoundCloud listing.

## Verification

- Test each recording through `http://localhost:8000`, not by opening `index.html` with a `file://` URL.
- Confirm SoundCloud `PLAY`, `PAUSE`, and `FINISH` events update the row icon and soundbar correctly.
- Confirm Spotify playback pauses SoundCloud and updates the shared soundbar correctly.
- Confirm the soundbar remains visible while paused and hides when navigation or other non-track controls are used.
- Confirm Watch thumbnails display and open the existing in-page YouTube modal without Error 153.
- Do not treat a generic soundbar message as proof that audio is playing; use widget events.

## Known Constraints

- The client-side password gate is intentionally insecure, applies only to the deployed GitHub Pages host, and is only a testing deterrent.
- The visualizer is simulated because SoundCloud does not expose audio amplitude through its Widget API.
- The contact form is local-only and does not send email without a backend or form-service integration.
- Tailwind CDN warnings are expected for this prototype; production could build Tailwind locally.

## Image Performance

- Create a smaller mobile-appropriate portrait derivative, around `900 x 600`.
- Use responsive `srcset` so mobile loads the smaller file.
- Keep the current image for desktop and high-density displays.
