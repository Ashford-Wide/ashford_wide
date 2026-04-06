# Known Gaps / Future Work

| Item | Notes |
|------|-------|
| **Default OG image** | `static/images/og-default.jpg` needs creating at 1200×630px — logo on a branded background. Until it exists, pages without a specific `image:` param will have no social preview image. |
| **Team data** | `data/team.yaml` exists but no template renders it |
| **Business directory nav link** | Not yet in the header nav — add a link to `/business-directory/` when ready |
| **Data-driven navigation** | Header nav is hardcoded in `header.html`; could be moved to `hugo.toml` menus |

## Cloudflare Features

| Feature | CSP addition required |
|---|---|
| [Web Analytics](https://developers.cloudflare.com/analytics/web-analytics/) | `script-src static.cloudflareinsights.com` + `connect-src cloudflareinsights.com` |
| [Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) | `script-src ajax.cloudflare.com` — also breaks `integrity` checks on scripts |
| [Zaraz](https://developers.cloudflare.com/zaraz/) | `script-src 'unsafe-inline'` or per-tool origins |
| [Turnstile](https://developers.cloudflare.com/turnstile/) | `script-src challenges.cloudflare.com` + `frame-src challenges.cloudflare.com` |
