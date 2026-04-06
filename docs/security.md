# Security

## Content Security Policy

HTTP response headers are set via `static/_headers`, which [Cloudflare Pages reads automatically](https://developers.cloudflare.com/pages/configuration/headers/).

Current policy summary:

| Directive | Value | Reason |
|---|---|---|
| `script-src` | `'self' https://unpkg.com https://player.vimeo.com` | Sveltia CMS and Vimeo player loaded from unpkg CDN |
| `style-src` | `'self' 'unsafe-inline' https://unpkg.com` | `style="..."` attributes in templates; Sveltia styles from unpkg |
| `img-src` | `'self' https: data:` | Business directory logos link to arbitrary external domains |
| `frame-src` | `https://player.vimeo.com` | Vimeo embed on the homepage |
| `default-src` | `'self'` | Everything else self-hosted |
| `connect-src` | `'self' https://ashford-wide.pages.dev https://unpkg.com https://api.github.com` | Sveltia CMS communicates with GitHub API |
| `object-src` | `'none'` | Prevent `<object>` and `<embed>` |
| `base-uri` | `'self'` | Prevent `<base>` tag hijacking |
| `form-action` | `'self' https://www.paypal.com https://formspree.io` | PayPal donate form and Formspree contact form submissions |

Note: `unsafe-eval` was previously required by Decap CMS and has been removed now that Sveltia CMS is in use.

## Traffic Advice (`/.well-known/traffic-advice`)

The file at `static/.well-known/traffic-advice` is served at `/.well-known/traffic-advice` and opts the site in to [Google's Private Prefetch Proxy](https://developer.chrome.com/docs/privacy-security/private-prefetch-proxy). This allows Chrome to speculatively prefetch pages on behalf of users arriving from Google Search, improving perceived load time.

```json
[{
  "user_agent": "prefetch-proxy",
  "fraction": 1.0
}]
```

`fraction` is a value between `0.0` and `1.0` controlling what proportion of prefetch requests are allowed. `1.0` permits all of them. This is appropriate for a fully public static site with no personalised or gated content.

The file is served with `Content-Type: application/trafficadvice+json`, set via the `/.well-known/traffic-advice` rule in `static/_headers`.
