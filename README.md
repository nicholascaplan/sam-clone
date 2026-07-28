# Samantha Fernando Website Redesign

This project is a redesigned, single-page version of Samantha Fernando's website:

<https://www.samanthafernando.com>

Samantha Fernando is a British composer whose work includes orchestral, chamber, choral, operatic, and immersive hyper-reality projects. The redesign presents her biography, works catalogue, events, past performances, videos, recordings, writing, featured projects, and contact information in a more focused portfolio experience.

## Project Structure

- `index.html` contains the complete website, including markup, styling, navigation, interactive sections, and project data.
- `assets/` contains the local image assets used throughout the site.
- `Website Content Map & Specifications.md` contains the source content map and page-by-page requirements from the existing website.
- `Website Critique & Redesign Strategy.md` contains the redesign critique and information-architecture recommendations.

## Navigation

The redesign intentionally keeps the existing draft's six menu items:

- Biography
- Works List
- Watch
- Listen
- Writing
- Contact

Events, past performances, and featured projects are presented within these existing sections rather than adding new top-level navigation items.

## Running Locally

Serve the directory with a local static web server rather than opening `index.html` directly. Opening the file with a `file://` URL can prevent YouTube's embedded player from identifying the page and cause Error 153.

From the project directory, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Stop the server with `Ctrl+C` when finished.

The page uses Tailwind CSS, Font Awesome, and Google Fonts via CDN links, so an internet connection is required for those external resources.

## Content and Links

Content should remain faithful to the supplied content specification. External video links point to Samantha Fernando's YouTube portfolio, while recordings and score/performance-material requests are directed toward the contact experience where appropriate.

This is a static front-end prototype. The contact form currently demonstrates the interaction locally and does not send email without a backend or form-service integration.

## Design Lessons and Style Guidelines

The following guidelines came from reviewing and refining the first draft. Preserve them when extending the site.

### Visual Direction

- The site should feel like a contemporary composer portfolio, not a developer dashboard.
- Prefer editorial, calm, spacious, and human visual language over technical or interface-heavy styling.
- Use the existing serif display and body typography for headlines and prose, with Inter for supporting labels and controls.
- Do not use monospace or fixed-width typography for visible navigation, metadata, headings, buttons, or content labels.
- Avoid visible section numbering such as `01.` and `02.` because it makes the site feel overly technical.

### Colour and Contrast

- Light mode is the default landing-page theme.
- Accent colours should be muted and readable. Yellow text on pale backgrounds is difficult to read, so use a darker amber or brown for light-mode accent text.
- Warning and information panels should use dark text on a pale, restrained background. Avoid low-contrast pink or yellow text combinations.
- Controls should not become solid black or overly saturated in light mode. Use translucent neutral backgrounds with a visible border and readable text.
- Always check contrast for text, links, icons, and hover states against the actual light and dark backgrounds.

### Layout and Spacing

- Related cards should use consistent heights and align their internal panels and actions to a shared baseline.
- Use explicit spacing between stacked panels, metadata boxes, and buttons. Adjacent rounded boxes can look like one merged component.
- Reserve space for variable-length descriptions when cards need aligned lower content.
- Do not let hover states, tooltips, playing states, or changing labels alter header height or surrounding layout.
- Keep controls a fixed size across all states. Use an icon or subtle status indicator instead of changing button labels or dimensions.

### Interaction Guidelines

- Use a moon icon in light mode to indicate that clicking will switch to dark mode; use a sun icon in dark mode for the reverse action.
- The Soundscape control should have a clear accessible label such as “Listen to Samantha's music”.
- Custom tooltips should appear quickly and be absolutely positioned so they do not cause layout shifts. Native `title` tooltips have an inconsistent delay.
- When audio is playing, show a fixed playback indicator with the actual track title and performer, not only a generic “playing” message.
- Keep the Soundscape button label stable and show play/pause state with a small icon.
- Embedded YouTube videos should open in an in-page modal. Test them through `http://localhost`, not by opening the HTML file with a `file://` URL.

### Content Placement

- Do not add new top-level navigation items without explicit approval.
- Events, past performances, and featured project information should fit within the existing navigation structure.
- Place explanatory notices after the primary action or content they qualify. For example, recording-availability notes belong below the track list so they do not interrupt listening.

## Handoff Notes

### Current Audio Implementation

- The Listen control uses SoundCloud's official Widget API rather than the original generated Web Audio soundscape.
- The player iframe must remain in the document and be visually hidden with CSS. Do not use `display: none`, because the SoundCloud widget cannot initialise reliably when its iframe is hidden that way.
- The UI listens for SoundCloud `PLAY`, `PAUSE`, and `FINISH` events before changing the soundbar and play/pause state.
- The active Listen row should change from a play icon to a pause icon only after SoundCloud confirms playback.
- The soundbar displays the selected title and performer and is hidden when playback pauses or finishes.
- SoundCloud embed URLs must use the exact source format supplied in SoundCloud's generated iframe code. For migrated tracks, this often includes an encoded identifier such as `soundcloud:tracks:<id>` rather than a plain numeric API URL.

### Confirmed Audio Sources

The following tracks have confirmed SoundCloud embed sources in the current implementation or content map:

- `Fault Line` — track ID `236811796`
- `4 Illuminations` — track ID `105152235`
- `Kinesphere` extract — track ID `332996028`
- `Recollection` — track ID `125817887`
- `Look Up` — track ID `204818278`
- `The Journey Between Us: Reflection 1` — track ID `292087616`
- `Positive/Negative Space` — track ID `132165483`
- `Square Of Light` — track ID `105347231`

### Next Steps

- Obtain confirmed SoundCloud iframe code or track IDs for `Balconies`, `3 Songs`, `Everything Passes, Everything is Connected`, and `Have It All`.
- Add those confirmed sources to the `soundcloudTracks` map in `index.html`.
- Update the corresponding Listen rows and the confirmed-source section of `Website Content Map & Specifications.md`.
- Test each source through `http://localhost:8000`, not by opening `index.html` with a `file://` URL.
- Confirm that each track produces a SoundCloud `PLAY` event, changes its row icon to pause, displays the correct title in the soundbar, and returns to play when finished.
- Do not treat a generic soundbar message as proof that audio is playing; the UI must be driven by the widget events.

### Console Error Context

- A `404` from `w.soundcloud.com/player` or `api-widget.soundcloud.com/resolve` means the supplied SoundCloud source cannot be resolved. Do not guess alternate permalink or numeric API formats; request the exact generated embed code.
- `MutationObserver ... parameter 1 is not of type 'Node'` from `web-client-content-script.js` is produced by a browser extension or injected browser script, not by this project.
- The Tailwind CDN warning is expected in this prototype. A production deployment should install and build Tailwind locally instead of using `cdn.tailwindcss.com`.
- A Canvas `createPattern` error may come from an injected browser tool or extension when an image/canvas has zero dimensions; investigate only if it can be reproduced without browser extensions.

### Recent UX Decisions

- Light mode is the default landing-page theme.
- The theme control shows a moon in light mode and a sun in dark mode.
- The Listen control has a fixed size, a small play/pause icon, and a quick custom tooltip reading “Listen to Samantha's music”.
- Tooltips are absolutely positioned so they do not shift the header or navigation border.
- Avoid fixed-width/monospace styling, visible section numbering, dark solid controls, low-contrast yellow text, and adjacent rounded boxes without spacing.
- Featured project cards use equal-height layouts, aligned metadata panels, aligned buttons, and explicit gaps between stacked boxes.
- The recording availability notice appears below the track list so it does not interrupt listening.
