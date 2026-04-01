# Ashford Wide — Technical Documentation

## Project Overview

Static website for Ashford Wide, a Business Improvement District (BID) and community initiative in Ashford, Kent. The site is built with Hugo and deployed to Cloudflare Pages. Content is managed via Decap CMS at `/admin/`.

**Live domain:** `https://www.ashfordwide.com/`  
**Stack:** Hugo v0.159.1 · Tailwind CSS v3 · No JS framework · Decap CMS · Cloudflare Pages

---

## Directory Structure

ashford_wide/
├── hugo.toml                    # Site configuration
├── package.json                 # Tailwind CSS & PostCSS dependencies
├── tailwind.config.js           # Tailwind theme configuration
├── postcss.config.js            # PostCSS configuration for Hugo Pipes
├── assets/
│   └── css/main.css             # Tailwind base, components, and utilities
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
baseURL = "https://www.ashfordwide.com/"
languageCode = "en-gb"
title = "Ashford Wide"
publishDir = "public"
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
| `layouts/news/list.html` | News index — grid sorted by date descending |
| `layouts/news/single.html` | Single news article with breadcrumb |
| `layouts/_default/single.html` | Generic single page — page header + article content |
| `layouts/_default/business-directory.html` | Business directory — data-driven, category filter, JS filtering |
| `layouts/_default/list.html` | Default section list (fallback) |
| `layouts/_default/taxonomy.html` | Tag/taxonomy pages |
| `layouts/sitemap.xml` | Custom sitemap — `<loc>` and `<lastmod>` only, no priority/changefreq |
| `layouts/404.html` | 404 page (stub — needs content) |

### Key Template Patterns

**Accessing data files** — use `hugo.Data` (not the deprecated `.Site.Data`):
```go
{{ $businesses := hugo.Data.businesses }}
{{ $members := hugo.Data.members }}
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

There is no JavaScript framework. Two small inline scripts only:

**Mobile nav toggle** — in `layouts/partials/footer.html`:
```js
const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
}
```

**Business directory category filter** — inline at the bottom of `layouts/_default/business-directory.html`:
```js
// Sets data-category on each .biz-card, filter buttons toggle .active,
// cards are shown/hidden via display:none
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

## Build

Because Tailwind is built dynamically, NPM dependencies must be installed first:

```bash
npm install   # Required before first build
hugo          # development build
hugo --minify # production build (used by Cloudflare Pages)
hugo server   # local dev server at http://localhost:1313
```

Current output: ~28 pages.
