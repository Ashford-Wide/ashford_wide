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
| `layouts/business-member/single.html` | Single business member profile page — hero image, logo + contact details panel, social icons row, optional intro prose, two-column promo section grid |
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
| `partials/homepage/*.html` | Seasonal/campaign promo blocks — one loaded on the homepage when `activePromo` is set in `hugo.toml` (see [Homepage Promotions](#homepage-promotions)) |
| `partials/jsonld/org.html` | Schema.org `Organization` JSON-LD — output on every page |
| `partials/jsonld/article.html` | Schema.org `NewsArticle` JSON-LD — output on news single pages via `head_extra` |
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


## Homepage Promotions

Seasonal or campaign-specific promotional blocks can be added to the homepage without touching `index.html`. Each promotion is a self-contained partial in `layouts/partials/homepage/`. One can be activated at a time via `hugo.toml`.

### Enabling a promo

Set `activePromo` in `hugo.toml` to the filename of the partial (without `.html`):

```toml
[params]
  activePromo = "best-dressed-window"
```

Set it to an empty string (or omit it) to show nothing:

```toml
  activePromo = ""
```

The block renders between the hero and the About section on the homepage.

### Adding a new promo

Create a new file in `layouts/partials/homepage/`, e.g. `layouts/partials/homepage/summer-festival.html`, then set `activePromo = "summer-festival"` in `hugo.toml` and redeploy.

### Existing promos

| File | Campaign |
|------|----------|
| `partials/homepage/best-dressed-window.html` | Best Dressed Window & Best Dressed Christmas Tree voting |

### How it works

`layouts/index.html` contains:

```go
{{- with .Site.Params.activePromo -}}
  {{- partial (printf "homepage/%s.html" .) $ -}}
{{- end -}}
```

`with` short-circuits when `activePromo` is empty, so no partial is loaded. When set, Hugo resolves the partial path at build time — an invalid name will cause a build error, catching typos early.

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

## Business Member Pages

Individual business member profile pages live in `content/business-member/` and use `layouts/business-member/single.html`.

### Front matter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Business name |
| `description` | No | Short tagline shown beneath the title |
| `header_image` | No | Path to hero banner image (see sizing below). Falls back to the standard dark surface title bar if omitted |
| `logo` | No | Path to the business logo |
| `address` | No | Street address displayed in the contact panel |
| `placeId` | No | Google Maps Place ID — adds a map pin icon link next to the address |
| `telephone` | No | Phone number — rendered as a `tel:` link |
| `email` | No | Email address — rendered as a `mailto:` link |
| `website` | No | Full URL — displayed without the `https://` prefix |
| `facebook` | No | Facebook profile URL |
| `instagram` | No | Instagram profile URL |
| `linkedin` | No | LinkedIn profile URL |
| `twitter` | No | Twitter/X profile URL |
| `youtube` | No | YouTube channel URL |
| `tiktok` | No | TikTok profile URL |
| `sections` | No | List of promo cards rendered in a two-column grid (see below) |

### Hero image

The hero uses `aspect-[16/5]` (16:5). Recommended source image size: **1400 × 480px**. Hugo Pipes resizes and converts to WebP at build time. The subject should be centred vertically as `object-cover` crops equally from top and bottom on narrow viewports.

If `header_image` is omitted the page falls back to the standard dark (`bg-surface`) title bar used across the rest of the site.

### Promo sections

`sections` is a list of cards rendered two-per-row on medium+ screens. Each item supports:

| Field | Description |
|-------|-------------|
| `title` | Card heading |
| `content` | Body copy paragraph |
| `image` | Card image path — rendered at 16:9 |
| `link` | CTA button URL |
| `link_text` | CTA button label (defaults to `Learn More`) |

Example front matter:

```yaml
sections:
  - title: "Security"
    content: "Tailor-made solutions to protect your business."
    image: "/images/businesses/example/security.jpg"
    link: "https://example.com/security"
    link_text: "Discover More"
  - title: "People"
    content: "Supporting your most important asset."
    image: "/images/businesses/example/people.jpg"
    link: "https://example.com/people"
    link_text: "Read More"
```

### Social icons

Any social fields present in front matter are rendered as a row of circular icon buttons below the contact details, using the same hover style as the site footer. Supported: Facebook, Instagram, LinkedIn, Twitter, YouTube, TikTok. Icons live in `layouts/partials/icons/`.

### Adding a new business member page

1. Create `content/business-member/<slug>.md` with the relevant front matter fields above.
2. Add images to `static/images/businesses/<slug>/` (hero at 1400 × 788px, logo at any size — it renders `max-h-28` constrained).
3. Optionally add prose below the front matter — it renders as a centred article block between the contact panel and the promo sections.
