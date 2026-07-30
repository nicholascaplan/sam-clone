# Decisions

Short record of settled product, content and implementation decisions for the site.

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

### Use neutral editorial treatment for notices and labels

- Decision: Present the hero label as plain editorial text, and style recording availability as a neutral note rather than a warning panel.
- Reason: Avoid implying an error or alert where the content is informational.

### Keep the client-side password gate

- Decision: Retain the intentionally insecure password gate on the deployed GitHub Pages host.
- Reason: It is a testing deterrent, not a security boundary, and is not required during local development.
