# Security

## Content Security Policy

HTTP response headers are set via `static/_headers`, which [Cloudflare Pages reads automatically](https://developers.cloudflare.com/pages/configuration/headers/).

Current policy summary:

| Directive | Value | Reason |
|---|---|---|
| `script-src` | `'self' 'unsafe-inline' https://unpkg.com https://www.youtube.com https://www.instagram.com` | `style="..."` attributes in templates; Sveltia CMS from unpkg; YouTube and Instagram embeds |
| `style-src` | `'self' 'unsafe-inline' https://unpkg.com` | `style="..."` attributes in templates; Sveltia styles from unpkg |
| `img-src` | `'self' https: data:` | Business directory logos link to arbitrary external domains |
| `frame-src` | `https://player.vimeo.com https://www.youtube.com https://www.youtube-nocookie.com https://www.instagram.com` | Vimeo, YouTube, and Instagram embeds |
| `default-src` | `'self'` | Everything else self-hosted |
| `connect-src` | `'self' https://ashford-wide.pages.dev https://unpkg.com https://api.github.com` | Sveltia CMS communicates with GitHub API |
| `object-src` | `'none'` | Prevent `<object>` and `<embed>` |
| `base-uri` | `'self'` | Prevent `<base>` tag hijacking |
| `form-action` | `'self' https://www.paypal.com` | PayPal donate form |
| `frame-ancestors` | `'none'` | Prevent the site being embedded in iframes on other origins |

Note: `unsafe-eval` was previously required by Decap CMS and has been removed now that Sveltia CMS is in use.

## Other Security Headers

The following headers are also set on all `/*` responses:

| Header | Value | Reason |
|---|---|---|
| `X-Frame-Options` | `DENY` | Legacy framing protection (complements `frame-ancestors 'none'`) |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage on cross-origin navigation |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable browser features not used by the site |

## Traffic Advice (`/.well-known/traffic-advice`)

The file at `static/.well-known/traffic-advice` is served at `/.well-known/traffic-advice` and opts the site in to [Google's Private Prefetch Proxy](https://developer.chrome.com/blog/private-prefetch-proxy). This allows Chrome to speculatively prefetch pages on behalf of users arriving from Google Search, improving perceived load time.

```json
[{
  "user_agent": "prefetch-proxy",
  "fraction": 1.0
}]
```

`fraction` is a value between `0.0` and `1.0` controlling what proportion of prefetch requests are allowed. `1.0` permits all of them. This is appropriate for a fully public static site with no personalised or gated content.

The file is served with `Content-Type: application/trafficadvice+json`, set via the `/.well-known/traffic-advice` rule in `static/_headers`.
