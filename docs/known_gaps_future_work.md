# Known Gaps / Future Work

| Item | Notes |
|------|-------|
| **Data-driven navigation** | Header nav is hardcoded in `header.html`; could be moved to `hugo.toml` menus |

## Cloudflare Features

| Feature | CSP addition required |
|---|---|
| [Web Analytics](https://developers.cloudflare.com/analytics/web-analytics/) | `script-src static.cloudflareinsights.com` + `connect-src cloudflareinsights.com` |
| [Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) | `script-src ajax.cloudflare.com` — also breaks `integrity` checks on scripts |
| [Zaraz](https://developers.cloudflare.com/zaraz/) | `script-src 'unsafe-inline'` or per-tool origins |
| [Turnstile](https://developers.cloudflare.com/turnstile/) | `script-src challenges.cloudflare.com` + `frame-src challenges.cloudflare.com` |
