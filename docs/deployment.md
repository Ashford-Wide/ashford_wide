# Deployment

This site is hosted on **Cloudflare Pages**, built automatically from the `main` branch of the GitHub repository at `Ashford-Wide/ashford_wide`.

## How deployment works

Cloudflare Pages watches the `main` branch. Every push to `main` triggers a new build and deployment automatically — no manual steps needed. The build command is `hugo --minify` and the output directory is `public`.

Cloudflare Pages runs the Hugo build itself, so there is no build step in GitHub Actions for production deploys.

### Build settings (Cloudflare Pages dashboard)

| Setting | Value |
|---|---|
| Framework preset | Hugo |
| Build command | `hugo --minify` |
| Build output directory | `public` |
| Root directory | *(leave blank)* |

Hugo version is not pinned in Cloudflare Pages config — if a specific version is ever required, set the `HUGO_VERSION` environment variable in the Cloudflare Pages dashboard.

## Daily rebuild

Because Hugo's `now` is evaluated at build time, events will not move from upcoming to past unless the site is rebuilt. A scheduled GitHub Actions workflow triggers a fresh Cloudflare Pages build every day at 2am UTC:

**[`.github/workflows/daily-rebuild.yml`](../.github/workflows/daily-rebuild.yml)**

This workflow POSTs to a Cloudflare Pages Deploy Hook. The hook URL is stored as a GitHub repository secret named `CLOUDFLARE_DEPLOY_HOOK_URL`.

To create or replace the hook: Cloudflare Pages dashboard → your project → **Settings → Builds & deployments → Deploy Hooks**. After generating the URL, add or update the repository secret at **GitHub → Settings → Secrets and variables → Actions → Repository secrets**.

## GitHub Actions workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `daily-rebuild.yml` | Daily at 2am UTC + manual | Triggers Cloudflare Pages rebuild so event dates stay current |
| `a11y.yml` | Push/PR to `main` | Runs WCAG 2.2 AA accessibility tests |
| `update.yml` | Daily at 7am UTC + manual | Upgrades npm packages and opens a PR |

## CMS (Sveltia)

The CMS is served at `/admin/`. It commits content changes directly to the `main` branch via the GitHub API, which triggers a Cloudflare Pages build automatically.

The CMS backend is configured in [`static/admin/config.yml`](../static/admin/config.yml). The `repo` field must match the GitHub repository slug:

```yaml
backend:
  name: github
  repo: Ashford-Wide/ashford_wide
  branch: main
```

In local development the CMS uses the File System Access API (Chrome/Edge only) to edit files directly without committing to GitHub.

Editor sign-in (production only, via GitHub OAuth) is handled by a separate Cloudflare Worker, [`Ashford-Wide/aw-auth`](https://github.com/Ashford-Wide/aw-auth) — it has its own deploy lifecycle independent of this repo's Pages build. See [`docs/sveltia_cms.md`](sveltia_cms.md) for full setup details.

## Resources cache

Hugo saves processed images to `/resources/_gen/images/`. This directory is committed to the repository so Cloudflare Pages does not re-process images on every deploy. After adding or replacing source images, commit the updated cache alongside the source files.
