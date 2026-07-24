# CMS Infrastructure (Sveltia CMS)

Full reference: [Sveltia CMS docs](https://sveltiacms.app/en/docs/intro) · [Hugo framework guide](https://sveltiacms.app/en/docs/frameworks/hugo)

Served at `/admin/`. Edits are committed directly to the GitHub repo, triggering a Cloudflare Pages rebuild (~30 seconds).

[Sveltia CMS](https://sveltiacms.app/en/docs/intro) is a drop-in replacement for Decap CMS. It uses the same `config.yml` schema and the same GitHub OAuth flow, but is significantly smaller (~600 KB vs 1.5 MB) and does not require `unsafe-eval` in the CSP.

This page covers authentication, hosting infrastructure, and local development. For what content editors can create and how the Markdown editor behaves, see [docs/editorial/cms_collections.md](../editorial/cms_collections.md).

## Authentication

Sveltia CMS authenticates editors via [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app). The OAuth flow is handled by a standalone Cloudflare Worker, [`Ashford-Wide/aw-auth`](https://github.com/Ashford-Wide/aw-auth) (a deployment of [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)) — this is a separate Cloudflare Worker project, not part of this repo's Pages build, deployed independently via its own `wrangler deploy`.

```mermaid
sequenceDiagram
    actor Editor
    participant CMS as Sveltia CMS<br/>(/admin)
    participant W as aw-auth Worker<br/>(aw-auth.ashford-wide.workers.dev)
    participant GH as GitHub

    Editor->>CMS: Visit /admin, click "Login with GitHub"
    CMS->>W: Open popup → GET /auth
    W->>GH: Redirect to github.com/login/oauth/authorize
    GH->>Editor: Show "Authorise Ashford Wide CMS Auth" screen
    Editor->>GH: Approve
    GH->>W: Redirect to /callback?code=xxx
    W->>GH: POST /login/oauth/access_token (exchange code)
    GH->>W: Return access token
    W->>CMS: postMessage → authorization:github:success:{token}
    CMS->>Editor: CMS loads, editor can create/edit content
```

Collaborator access is not checked by the Worker itself — the GitHub token it returns is scoped to whatever access the authenticating user already has on the repo. A non-collaborator can complete the OAuth flow but their subsequent GitHub API calls (reading/writing content) will fail with permission errors.

### GitHub OAuth App

Registered under the org, not a personal account: `https://github.com/organizations/Ashford-Wide/settings/applications`.

| Field | Value |
|---|---|
| Homepage URL | `https://www.ashfordwide.com` |
| Authorization callback URL | `https://aw-auth.ashford-wide.workers.dev/callback` |

Only Ashford-Wide org owners can view/edit this OAuth App or rotate its client secret.

### aw-auth Worker configuration

Deployed from [`Ashford-Wide/aw-auth`](https://github.com/Ashford-Wide/aw-auth) via `wrangler deploy`, to `https://aw-auth.ashford-wide.workers.dev`.

| Variable | Type | Value |
|----------|------|-------|
| `GITHUB_CLIENT_ID` | secret (`wrangler secret put`) | From the GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | secret (`wrangler secret put`) | From the GitHub OAuth App |
| `ALLOWED_DOMAINS` | var | `www.ashfordwide.com` — restricts which sites can use this Worker's OAuth flow |

### `static/admin/config.yml`

```yaml
backend:
  name: github
  repo: Ashford-Wide/ashford_wide
  branch: main
  base_url: https://aw-auth.ashford-wide.workers.dev/
```

`auth_endpoint` is left at its default (`/auth`), matching the route the Worker exposes.

### CSP requirements

`static/_headers` must allow the Worker origin in `connect-src` (the login popup calls it via `fetch`/XHR), and must allow Sveltia CMS's own asset loading:

| Directive | Addition | Reason |
|---|---|---|
| `connect-src` | `https://aw-auth.ashford-wide.workers.dev` | OAuth token exchange |
| `connect-src` | `data:` | Sveltia loads its branding logo as a `data:` URI |
| `connect-src` | `https://www.githubstatus.com` | Sveltia's backend-status indicator |
| `style-src` | `https://fonts.googleapis.com` | Sveltia's Google Fonts stylesheet |
| `font-src` | `'self' https://fonts.gstatic.com` | Not set previously, so it fell back to `default-src 'self'` and blocked the font files |
| `img-src` | `blob:` | Sveltia's local image previews (e.g. before an upload is committed) |
| `manifest-src` | `'self' blob:` | Sveltia dynamically generates a web app manifest as a `blob:` URL |

See [`docs/technical/security.md`](security.md) for the full current policy.

### Managing editor access

Access is controlled by [GitHub repository collaborators](https://docs.github.com/en/rest/collaborators/collaborators). To grant CMS access to an editor:

- GitHub repo → Settings → Collaborators → Add people → enter their GitHub username

As noted above, access isn't gated at login — a non-collaborator can still open `/admin/` and sign in with GitHub, but every subsequent read/write to content will fail with a GitHub permission error because their token has no access to the repo. So in practice, adding or removing someone as a GitHub collaborator is the only access control that matters.

To revoke access, remove them as a collaborator on GitHub.

## Local development

Sveltia CMS does not use a proxy server for local development. Instead it uses the browser's [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) to read and write files directly in your local repo.

1. Run `hugo server` as normal
2. Visit `http://localhost:1313/admin/`
3. When prompted, open your local repo folder via the browser file picker
4. Edits are written directly to your local files
5. Commit and push changes using git as normal

**Browser compatibility:** Chrome or Edge required for File System Access API. Safari support is limited.

For the collections editors see inside the CMS and what they manage, see [docs/editorial/cms_collections.md](../editorial/cms_collections.md).
