# Sanity Operations

Operational guide for the Sanity CMS that manages site content. Settled design decisions are in `docs/decisions.md`; the content itself is in `docs/content.md`. Never record tokens or secrets here.

## Key Locations

| What | Where |
|---|---|
| Sanity Studio (editing) | https://samantha-fernando.sanity.studio |
| Sanity Manage (project settings) | https://www.sanity.io/manage/project/9a66iw1t |
| API settings and webhooks | https://www.sanity.io/manage/project/9a66iw1t/api |
| Members and roles | https://www.sanity.io/manage/project/9a66iw1t/members |
| Project ID and dataset | `9a66iw1t`, `production` (public identifiers) |
| Studio source | `studio/` in this repository |
| Studio hostname | `samantha-fernando` (app ID is pinned in `studio/sanity.cli.ts`) |

Studio is where content is edited. Manage is where the project is administered: members, webhooks, API tokens, CORS and plan. Webhooks are not in the Studio.

## How Publishing Works

1. An editor changes the Biography Page in the Studio and clicks **Publish**.
2. The Sanity webhook `Trigger site deploy` sends a `repository_dispatch` event (`sanity-content-published`) to GitHub.
3. The Pages workflow (`.github/workflows/pages.yml`) runs the tests, builds the site with `npm run build:content` and deploys it.
4. The change is live in about two minutes.

Only published content is used. Drafts never affect the site. If Sanity is unreachable or the document is incomplete, the build logs a `Sanity content unavailable` warning and ships the committed Biography markup in `index.html`.

## Editing Content (Editors)

- Sign in at the Studio URL and open **Biography Page**.
- Use bold for ensemble and organisation names and italic for work titles. Follow the copy conventions in `docs/content.md`: British English, no em dashes, no Oxford commas. The Studio blocks em dashes, requires image alt text and requires four-digit milestone years; it cannot check spelling or commas.
- There is no live preview. Publish, wait about two minutes, then check the live page. Sanity keeps document history, so earlier versions can be restored from the document's history menu.
- Only the Biography Page is editable so far. Other sections move over one at a time (see `docs/next-steps.md`).

## Members And Roles

- Manage members at the Members link above. Invite people by email; they can sign in with Google, GitHub or email.
- Give editors the **Editor** role. It allows editing and publishing content but not changing members, webhooks or the dataset. Reserve **Administrator** for site maintainers.
- Samantha was invited as an Editor on 7 October 2026.

## Publish Webhook

Configured under **API**, then **Webhooks** in Sanity Manage.

| Field | Value |
|---|---|
| Name | `Trigger site deploy` |
| URL | `https://api.github.com/repos/nicholascaplan/sam-clone/dispatches` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_id == "biographyPage"` |
| Projection | `{"event_type": "sanity-content-published"}` |
| Method | `POST` |
| Headers | `Authorization` set to `Bearer <token>` (word `Bearer`, one space, no colon) and `Accept: application/vnd.github+json` |
| Drafts | Off |

Add the document ID to the filter when a new section is migrated to Sanity, for example `_id in ["biographyPage", "<newId>"]`.

### GitHub Token

The header uses a GitHub fine-grained personal access token. It is stored only in the webhook's headers in Sanity Manage; never put it in the repository, docs, logs or chat.

- Repository access: only `nicholascaplan/sam-clone`.
- Permissions: **Contents: Read and write** (required for `repository_dispatch`) and the mandatory read-only **Metadata**.
- **Expiry: 90 days.** The current token was created on 7 October 2026 and expires on or about **5 January 2027**. Check the exact date in GitHub under Settings, Developer settings, Personal access tokens, Fine-grained tokens.
- **Renew before it expires.** An expired token fails silently for editors: publishing still works in Sanity but the site is not rebuilt.

To renew: create a new token with the same repository and permissions, edit the webhook's `Authorization` header to `Bearer <new token>`, publish a small test edit and confirm a `204` in the webhook's attempts log and a new "Deploy GitHub Pages" run. Then delete the old token and update the expiry date in this document.

### Troubleshooting

Open the webhook in Manage and check **Attempts**.

| Result | Meaning |
|---|---|
| `204` | GitHub accepted the dispatch. A "Deploy GitHub Pages" run should start within seconds. |
| `401` "Requires authentication" | The `Authorization` header is missing or lacks the `Bearer ` prefix. |
| `401` "Bad credentials" | The token is wrong or has expired. Renew it. |
| `403` or `404` | The token lacks Contents write access, is not scoped to `sam-clone`, or the URL is wrong. |
| `422` | The projection is not `{"event_type": "sanity-content-published"}`. |
| No attempt | The trigger or filter did not match, or the edit was only a draft. |

If the webhook cannot be fixed immediately, deploy manually with `gh workflow run "Deploy GitHub Pages"`; the build reads published content.

## Studio Development

All commands run from `studio/`.

```bash
npm run dev      # local Studio at http://localhost:3333
npm run deploy   # publish schema changes to the hosted Studio (needs `npx sanity login`)
npx sanity schema validate
npx tsc --noEmit
```

- Schema changes must be deployed with `npm run deploy` before editors see them. The hosted Studio auto-updates the Sanity version.
- Biography is a singleton with the fixed document ID `biographyPage`. Follow the same pattern for new singletons: fixed ID, hidden from generic lists and no duplicate, delete or unpublish actions (see `studio/structure.ts` and `studio/sanity.config.ts`).
- `studio/scripts/seed-biography.ts` recreates the Biography document from the original copy: `npx sanity exec scripts/seed-biography.ts --with-user-token`. It overwrites the published document, so use it only to restore or reseed.
- Document history and the dataset live in Sanity, not in this repository.

## Sandbox Note For Maintainers

When working inside BoxedCode, the sandbox allowlist in `~/.nwb/box/box.json` must include `api.sanity.io`, `9a66iw1t.api.sanity.io`, `9a66iw1t.apicdn.sanity.io` and `cdn.sanity.io` for the build and Studio commands to reach Sanity.
