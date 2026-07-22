# Known Gaps / Future Work

| Item | Notes |
|------|-------|
| **Data-driven navigation** | Header nav is hardcoded in `header.html`; could be moved to `hugo.toml` menus |
| **Empty `content/business-member/` folder** | `layouts/business-member/single.html` and its docs describe a working business profile-page template, but no page currently exists in `content/business-member/` — the one example page that used to live there was created and deleted. The template is currently dead code from a content perspective. |
| **Dead partial: `layouts/partials/jsonld/closures.html`** | Hand-written `Event`/`Place` JSON-LD for the road closures page — not called by any template. Either wire it up or delete it. |
| **Stale script: `scripts/a11y-test.js`** | A CommonJS duplicate of the live `scripts/a11y-test.mjs` (the one `package.json` actually runs). Safe to delete once confirmed nothing else references it. |
| **daisyui is loaded for a single component** | Loaded in `assets/css/main.css` purely for its `carousel`/`carousel-item` classes, used only in `layouts/shortcodes/carousel.html`. Worth knowing before assuming it can be safely removed. |
| **No `data/members.yaml`** | Some older code comments/docs referenced a members data file distinct from the business directory; it never existed. The homepage member logo marquee reads from `data/businesses.yaml` instead — see [docs/hugo/data_files.md](hugo/data_files.md). |

## Cloudflare Features

| Feature | CSP addition required |
|---|---|
| [Web Analytics](https://developers.cloudflare.com/analytics/web-analytics/) | `script-src static.cloudflareinsights.com` + `connect-src cloudflareinsights.com` |
| [Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) | `script-src ajax.cloudflare.com` — also breaks `integrity` checks on scripts |
| [Zaraz](https://developers.cloudflare.com/zaraz/) | `script-src 'unsafe-inline'` or per-tool origins |
| [Turnstile](https://developers.cloudflare.com/turnstile/) | `script-src challenges.cloudflare.com` + `frame-src challenges.cloudflare.com` |
