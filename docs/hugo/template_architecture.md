# Template Architecture

Full reference: [Hugo templates](https://gohugo.io/templates/)

## Inheritance

All pages extend `layouts/_default/baseof.html` via `{{ define "main" }}` blocks:

```
baseof.html
  └── partial: head.html        (meta, CSS link, favicon, Open Graph tags, JSON-LD)
  └── block: head_extra         (defined per-template — e.g. event JSON-LD on event pages)
  └── partial: header.html      (sticky nav, logo, mobile toggle)
  └── block: main               (defined per-template)
  └── partial: footer.html      (3-column footer, social links, mobile nav JS)
```

`{{ block "head_extra" . }}{{ end }}` is defined in `baseof.html` directly (not inside `head.html`) so that page templates can override it. [Blocks inside partials do not participate in the template inheritance chain.](https://gohugo.io/templates/base/)

## Layout Files

| File | Purpose |
|------|---------|
| `layouts/index.html` | Homepage — hero, about section, upcoming events grid (first 3), membership CTA, member logo marquee, newsletter form |
| `layouts/events/list.html` | Events index — splits into upcoming/past using Hugo date comparisons; shows 3 most recent past events with a link to the full archive |
| `layouts/events/single.html` | Single event page with date/time/location meta panel; injects Event JSON-LD via `head_extra` |
| `layouts/events/past.html` | Full archive of all past events as a card grid, linked from the events index |
| `layouts/news/list.html` | News index — grid sorted by date descending, paginated (9 per page) |
| `layouts/news/single.html` | Single news article with breadcrumb |
| `layouts/_default/single.html` | Generic single page — page header + article content |
| `layouts/_default/business-directory.html` | Business directory — data-driven, category filter, JS filtering |
| `layouts/_default/list.html` | Default section list (fallback) |
| `layouts/_default/taxonomy.html` | Tag/taxonomy pages |
| `layouts/sitemap.xml` | Custom sitemap — `<loc>` and `<lastmod>` only, no priority/changefreq |
| `layouts/404.html` | 404 page |

## Partials

Full reference: [Hugo partials](https://gohugo.io/templates/types/#partial)

| File | Purpose |
|------|---------|
| `partials/head.html` | `<head>` contents — charset, viewport, title, description, CSS, SVG favicon, canonical, Open Graph, org JSON-LD |
| `partials/header.html` | Sticky nav, logo, mobile hamburger |
| `partials/footer.html` | 3-column footer (light theme), logo, social links, nav JS |
| `partials/opengraph.html` | Open Graph + Twitter Card meta tags — used on all pages |
| `partials/event-time.html` | Formats `startTime`/`endTime` frontmatter into a display range (e.g. `10am–3pm`) |
| `partials/jsonld/org.html` | Schema.org `Organization` JSON-LD — output on every page |
| `partials/jsonld/event.html` | Schema.org `Event` JSON-LD — output on event single pages via `head_extra` |
| `partials/jsonld/webpage.html` | Schema.org `WebPage` JSON-LD — output on default single pages via `head_extra` |

## Shortcodes

Full reference: [Hugo shortcodes](https://gohugo.io/shortcodes/) · [Custom shortcode templates](https://gohugo.io/templates/shortcode/)

| File | Purpose |
|------|---------|
| `shortcodes/param.html` | Outputs a site param by name — use in Markdown content to reference `hugo.toml` values without hardcoding them |
| `shortcodes/paypal-donate.html` | PayPal donation embed — used on the support page |

**`param` shortcode usage** — reference any `[params]` key from `hugo.toml` inside content Markdown:
```markdown
[{{</* param "email" */>}}](mailto:{{</* param "email" */>}})
[Facebook]({{</* param "facebook" */>}})
```
This keeps email addresses and social URLs in sync with `hugo.toml` across all content files.

**Instagram shortcode** — Hugo has a [built-in instagram shortcode](https://gohugo.io/shortcodes/instagram/):
```markdown
{{</* instagram POST_ID */>}}
```
By default this calls Instagram's oEmbed API. To avoid needing an access token, enable [simple mode](https://gohugo.io/shortcodes/instagram/#privacy) in `hugo.toml`, which generates a static image card instead:
```toml
[privacy]
  [privacy.instagram]
    simple = true
```

## Key Template Patterns

**Accessing data files** — use `site.Data` ([data templates reference](https://gohugo.io/functions/hugo/data/)):
```go
{{ $businesses := site.Data.businesses }}
{{ $members := site.Data.members }}
```

**Event date filtering:**
```go
{{- $events := where .Site.RegularPages "Section" "events" -}}
{{- $upcoming := (where $events ".Date" "ge" now).ByDate -}}
{{- $past := (where $events ".Date" "lt" now).ByDate.Reverse -}}
```

**Homepage upcoming events (first 3 only):**
```go
{{- $upcoming := where (where .Site.RegularPages "Section" "events") ".Date" "ge" now -}}
{{- $upcoming = $upcoming | first 3 -}}
```

**Custom layout for a content page** — set in front matter:
```yaml
layout: "business-directory"
```
Hugo looks for `layouts/_default/business-directory.html`.

**Rendering event time range:**
```go
{{ partial "event-time.html" . }}
```
Outputs nothing if `startTime` is not set. Outputs `10am` if only `startTime` is set. Outputs `10am–3pm` if both `startTime` and `endTime` are set.


## Navigation

The header nav is hardcoded in `layouts/partials/header.html` (not data-driven). Current structure:

- About Us
- Events
- Remembrance *(conditional — see below)*
- News
- Membership
- Business Directory
- Contact Us

The "SUPPORT US" button links to `/support`.

### Remembrance nav item

The Remembrance link is controlled by `showRemembrance` in `hugo.toml`. Set it to `true` to show the link in the nav, `false` to hide it. This allows the link to be enabled seasonally without a template change — just update `hugo.toml` and redeploy.
