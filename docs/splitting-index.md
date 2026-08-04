# Should `index.html` Be Split?

## Current Decision

No. Keep the single-page site until a concrete need outweighs the maintenance cost.

## Reconsider When

- Individual pages need search visibility, social previews or polished shareable URLs.
- The works, writing or project content grows beyond the current catalogue model.
- Route-specific loading would provide a measurable benefit.

## Trade-Off

Separate documents would interrupt audio playback and require duplicated navigation, theme, password-gate and shared-player behaviour without a build system.

## If Approved

Start with `/works/` and `/writing/`. Keep Listen and Watch as filters within Works & Media. Preserve `/` for the homepage and Biography, and keep Contact as either an in-page route or a simple dedicated page.
