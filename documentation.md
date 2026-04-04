# Ashford Wide — Technical Documentation

## Project Overview

Static website for Ashford Wide, a Business Improvement District (BID) and community initiative in Ashford, Kent. The site is built with Hugo and deployed to Cloudflare Pages. Content is managed via Decap CMS at `/admin/`.

**Live domain:** `https://www.ashfordwide.com/`  
**Stack:** Hugo v0.159.1 · Tailwind CSS v4 · No JS framework · Decap CMS · Cloudflare Pages

---

## Directory Structure

ashford_wide/
├── hugo.toml                    # Site configuration
├── package.json                 # Tailwind CSS & PostCSS dependencies
├── tailwind.config.js           # Tailwind theme configuration
├── postcss.config.js            # PostCSS configuration for Hugo Pipes
├── assets/
│   ├── css/main.css             # Tailwind base, components, and utilities
│   └── js/
│       ├── nav.js               # Mobile nav toggle (served via Hugo Pipes)
│       └── business-directory.js # Category filter for business directory
├── content/                     # Markdown content files
├── layouts/                     # Hugo templates
│   ├── _default/                # Catch-all templates
│   ├── events/                  # Event-specific templates
│   ├── news/                    # News-specific templates
│   ├── partials/                # Reusable template fragments
│   ├── index.html               # Homepage template
│   ├── sitemap.xml              # Custom sitemap template
│   ├── robots.txt               # Robots.txt template
│   └── 404.html                 # 404 page
├── static/
│   ├── _headers                 # Cloudflare Pages HTTP headers (CSP, etc.)
│   ├── images/                  # Static images (logo, member logos, etc.)
│   └── admin/
│       ├── index.html           # Decap CMS entry point
│       └── config.yml           # Decap CMS schema
└── data/
    ├── businesses.yaml          # Business directory entries
    ├── members.yaml             # Member logos for homepage marquee
    └── team.yaml                # Team member placeholders
```

---

## Configuration (`hugo.toml`)

```toml
baseURL = "https://ashford-wide.pages.dev"
languageCode = "en-gb"
title = "Ashford Wide"
publishDir = "public"
paginate = 9             # News list pages — 9 per page (fits 3-column grid evenly)
buildDrafts = false
buildFuture = true       # Required — events are often future-dated
enableRobotsTXT = true
disableHugoGeneratorInject = true

[params]
  description = "Working together for a better Ashford"
  tagline = "Working together for a better Ashford"
  email = "info@ashfordwide.com"
  facebook = "https://www.facebook.com/AshfordWide"
  twitter = "https://twitter.com/AshfordWide"
  instagram = "https://www.instagram.com/ashfordwide"

[markup.goldmark.renderer]
  unsafe = true   # Allows raw HTML inside Markdown (used in contact form, support page)

[taxonomies]
  tag = "tags"
```

`buildFuture = true` is essential — without it Hugo will not render pages for future-dated events.

---

## Content Architecture

### Content Types

```
content/
├── _index.md                        # Homepage (no body content — layout drives everything)
├── about.md
├── business-directory.md            # Uses layout: "business-directory"
├── business-membership.md
├── contact.md                       # Contains raw HTML Formspree form
├── membership.md
├── support.md                       # Contains raw HTML PayPal donation embed
├── volunteer.md
├── events/
│   ├── _index.md
│   ├── christmas-market-2025.md
│   ├── spring-festival-2026.md
│   └── summer-market-2026.md
├── news/
│   ├── _index.md
│   ├── welcome-to-ashford-wide.md
│   └── spring-events-announced.md
└── remembrance/
    ├── _index.md
    ├── order-of-services.md
    ├── sponsor-a-poppy.md
    └── virtual-poppy-wall.md
```

### Event Front Matter

```yaml
---
title: "Summer Market 2026"
date: 2026-07-11
time: "10am–3pm"
location: "High Street, Ashford"
description: "Short summary shown on event cards and in meta tags."
image: "/images/events/summer-market-2026.jpg"  # optional
---
```

The `date` field drives all event filtering. The events list template splits events into upcoming (`date >= now`) and past (`date < now`) automatically. No manual archiving is needed.

### News Front Matter

```yaml
---
title: "Spring Events Programme Announced"
date: 2026-03-15
author: "Ashford Wide Team"
description: "Short summary shown on news cards."
image: "/images/news/spring-events.jpg"  # optional
---
```

### Standard Page Front Matter

```yaml
---
title: "Page Title"
description: "Used in <meta name='description'> and page header subtitle."
layout: "business-directory"  # optional — overrides the default template
---
```

---

## Template Architecture

### Inheritance

All pages extend `layouts/_default/baseof.html` via `{{ define "main" }}` blocks:

```
baseof.html
  └── partial: head.html        (meta, CSS link, favicon)
  └── partial: header.html      (sticky nav, logo, mobile toggle)
  └── block: main               (defined per-template)
  └── partial: footer.html      (3-column footer, social links, mobile nav JS)
```

### Layout Files

| File | Purpose |
|------|---------|
| `layouts/index.html` | Homepage — hero, about section, upcoming events grid (first 3), membership CTA, member logo marquee, newsletter form |
| `layouts/events/list.html` | Events index — splits into upcoming/past using Hugo date comparisons |
| `layouts/events/single.html` | Single event page with date/time/location meta panel |
| `layouts/news/list.html` | News index — grid sorted by date descending, paginated (9 per page) |
| `layouts/news/single.html` | Single news article with breadcrumb |
| `layouts/_default/single.html` | Generic single page — page header + article content |
| `layouts/_default/business-directory.html` | Business directory — data-driven, category filter, JS filtering |
| `layouts/_default/list.html` | Default section list (fallback) |
| `layouts/_default/taxonomy.html` | Tag/taxonomy pages |
| `layouts/sitemap.xml` | Custom sitemap — `<loc>` and `<lastmod>` only, no priority/changefreq |
| `layouts/404.html` | 404 page (stub — needs content) |

### Key Template Patterns

**Accessing data files** — use `site.Data` (not `hugo.Data` or the older `.Site.Data` context-bound method):
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

---

## CSS & Styling (Tailwind CSS)

The project has been migrated from a custom CSS framework to **Tailwind CSS v4**.

### Setup & Workflow
- **Dependencies**: Tailwind CSS is built via `postcss` and `postcss-cli` using Hugo Pipes. An `npm install` is required after cloning the repo.
- **Entry Point**: `assets/css/main.css` processes Tailwind directives (`@import "tailwindcss";`, `@theme`, `@layer components`, etc.).
- **Hugo Integration**: Included in `layouts/partials/head.html` using Hugo's internal asset processing (`resources.PostCSS`).

### Design Tokens (`@theme` variables)
The legacy custom CSS variables have been mapped directly into the `@theme` block in `assets/css/main.css`:
- **Colors**: `--color-surface` (`#212529`), `--color-text` (`#333`), `--color-muted` (`#6c757d`).
- **Animations**: The homepage marquee animation is defined using `@keyframes marquee`.

### Custom Components
Any styling that is too complex for inline utility classes (or used extensively across markdown prose) is defined in `assets/css/main.css` within `@layer components`:
- `.article-content` — Used to style raw markdown output on single pages without needing an external typography plugin.
- `.nav-open` — Used by the mobile navigation JavaScript to disable scrolling.

---

## JavaScript

There is no JavaScript framework. Two small scripts served from `assets/js/` via Hugo Pipes (minified and fingerprinted in production):

**`assets/js/nav.js`** — loaded on every page via `layouts/partials/footer.html`:
Wires up the hamburger button (`#nav-toggle`) to toggle the `nav-open` class on `#main-nav` and update `aria-expanded`.

**`assets/js/business-directory.js`** — loaded only on the business directory page via `layouts/_default/business-directory.html`:
Handles category filter button clicks — toggles active styles on `.biz-filter` buttons and shows/hides `.biz-card` elements by matching `data-category`.

Both scripts are included using Hugo Pipes in the same pattern as the CSS:
```go
{{ $js := resources.Get "js/nav.js" }}
{{ if hugo.IsProduction }}
  {{ $js = $js | minify | fingerprint }}
{{ end }}
<script src="{{ $js.Permalink }}"{{ if hugo.IsProduction }} integrity="{{ $js.Data.Integrity }}"{{ end }}></script>
```

---

## Data Files

### `data/businesses.yaml`

Drives the `/business-directory/` page. Fields:

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes |
| `category` | string | yes — used for filter pills |
| `description` | string | yes |
| `website` | string | no |
| `telephone` | string | no |
| `mobile` | string | no |
| `email` | string | no |
| `address` | string | no |
| `facebook` | string (URL) | no |
| `instagram` | string (URL) | no |
| `x` | string (URL) | no |
| `twitter` | string (URL) | no |
| `logo` | string (path) | no |

### `data/members.yaml`

Drives the homepage member logo marquee. Fields: `name`, `logo` (image path).

### `data/team.yaml`

Placeholder team data. Fields: `name`, `role`. Not currently rendered in any template — needs a team section adding to `content/about.md` or a dedicated partial.

---

## Decap CMS (`static/admin/`)

Served at `/admin/`. Edits are committed directly to the GitHub repo, triggering a Cloudflare Pages rebuild (~30 seconds).

### Setup Required

1. Update `repo:` in `static/admin/config.yml` with the actual GitHub org/repo
2. Configure OAuth — either:
   - **Decap Cloud** (free): change backend to `name: git-gateway` and register at `app.decapcms.org`
   - **GitHub OAuth App**: create an OAuth App in GitHub, deploy a Cloudflare OAuth worker, keep `name: github`
3. Optionally add Cloudflare Access to restrict `/admin/` to specific email addresses

### CMS Collections

| Collection | Type | Manages |
|-----------|------|---------|
| `events` | folder | `content/events/*.md` |
| `news` | folder | `content/news/*.md` |
| `pages` | files | about, membership, business-membership, volunteer, support, contact |
| `remembrance` | files | All 4 remembrance pages |
| `members` | files | `data/members.yaml` |
| `businesses` | files | `data/businesses.yaml` |

---

## Navigation

The header nav is hardcoded in `layouts/partials/header.html` (not data-driven). Current structure:

- Home
- About Us → Who We Are, The Team (`/about#team`), Volunteer
- Events → All Events, Remembrance, Sponsor a Poppy, Virtual Poppy Wall
- News
- Membership → Join Ashford Wide, Business Membership
- Contact Us

The "SUPPORT US" button links to `/support`. The Business Directory is not yet in the nav — add a link to `/business-directory` when ready.

---

## Known Gaps / Future Improvements

- **404 page styling** — `layouts/404.html` is a stub (`<div>Page not found</div>`) and needs to be styled using Tailwind classes.
- **Tailwind Typography** — Markdown content (`.article-content`) is currently styled with custom component classes. In the future, you could install `@tailwindcss/typography` (`prose` class) for automatic, extensive markdown styling.
- **Data-driven Navigation** — The header nav is hardcoded in `layouts/partials/header.html`. This could be moved to `hugo.toml` menus for CMS integration.
- **Logo fallback** — Header falls back to text if `static/images/logo.png` is absent; `static/images/favicon.svg` is referenced but not committed
- **Team data** — `data/team.yaml` exists but no template renders it; the About page has an `#team` anchor with no content
- **Newsletter form** — Homepage form currently posts to `action="#"`; needs a Mailchimp embed or similar
- **Contact form** — `content/contact.md` uses a Formspree action placeholder (`your-form-id`); needs updating with the real form ID
- **Business directory nav link** — not in the header nav yet
- **Redirects** — A `static/_redirects` file is needed to map old WordPress URLs to new slugs

---

## Security

### Content Security Policy

HTTP response headers are set via `static/_headers`, which Cloudflare Pages reads and applies automatically. The file uses `#` comments to document each directive.

The full policy is a single line in `static/_headers` (required by the Cloudflare Pages `_headers` format — multi-line values and inline comments are not supported).

Current policy summary:

| Directive | Value | Reason |
|---|---|---|
| `script-src` | `'self'` | All JS is served from `/js/` via Hugo Pipes — no inline scripts |
| `style-src` | `'self' 'unsafe-inline'` | `style="..."` attributes are used in templates (e.g. `display:none` on the business directory empty state) |
| `img-src` | `'self' https: data:` | Business directory logos link to arbitrary external domains |
| `frame-src` | `https://www.youtube-nocookie.com` | YouTube embed on the homepage (`youtube-nocookie.com` avoids cross-site tracking) |
| `default-src` | `'self'` | Everything else self-hosted only |
| `object-src` | `'none'` | Prevent `<object>` and `<embed>` entirely |
| `base-uri` | `'self'` | Prevent `<base>` tag hijacking |
| `form-action` | `'self'` | Restrict where forms can submit |

### Cloudflare features

Wrangler is a CLI/deploy tool only and has no client-side presence — it does not affect the CSP.

The following Cloudflare features are not currently enabled, but would require CSP changes if added:

| Feature | Addition required |
|---|---|
| Web Analytics | `script-src static.cloudflareinsights.com` + `connect-src cloudflareinsights.com` |
| Rocket Loader | `script-src ajax.cloudflare.com` — also breaks `integrity` checks on scripts |
| Zaraz | `script-src 'unsafe-inline'` or per-tool origins |
| Turnstile | `script-src challenges.cloudflare.com` + `frame-src challenges.cloudflare.com` |

---

## Build

Because Tailwind is built dynamically, NPM dependencies must be installed first:

```bash
npm install   # Required before first build
hugo          # development build
hugo --minify # production build (used by Cloudflare Pages)
hugo server   # local dev server at http://localhost:1313
```

Current output: ~28 pages.
