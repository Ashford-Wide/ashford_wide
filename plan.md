# Ashfordwide.com — Static Site Rebuild Plan

**Stack:** Hugo + Decap CMS + Cloudflare Pages

-----

## Phase 1 — Project Setup & Infrastructure

### Repository

- Create a GitHub repo (Cloudflare Pages deploys directly from GitHub)
- Set up branch structure: `main` = production, `preview` = staging
- Cloudflare Pages will auto-deploy `main` and generate preview URLs for pull requests

### Hugo Initialisation

- Initialise a Hugo project with a sensible directory structure
- Build a lightweight custom theme rather than using an off-the-shelf one — the site is simple enough that a custom theme is cleaner than fighting someone else’s opinions
- Configure `config.toml` with site title, base URL, language settings, etc.

### Cloudflare Pages

- Connect the GitHub repo to Cloudflare Pages
- Set build command: `hugo --minify`
- Set output directory: `public`
- Configure custom domain (`ashfordwide.com`) via Cloudflare DNS

-----

## Phase 2 — Content Architecture

### Content Types (Markdown pages)

```
content/
  _index.md                         ← Homepage
  about.md
  membership.md
  business-membership.md
  volunteer.md
  contact.md
  support.md
  events/
    _index.md
    *.md                            ← One file per event
  news/
    _index.md
    *.md                            ← One file per news post
  remembrance/
    _index.md
    order-of-services.md
    sponsor-a-poppy.md
    virtual-poppy-wall.md
```

### Data Files (structured, non-page data)

```
data/
  businesses.yaml                   ← Business directory entries
  members.yaml                      ← Member logos for homepage
  team.yaml                         ← Team members
```

Example business directory entry in `businesses.yaml`:

```yaml
- name: Timeless IMS
  category: Technology
  description: "Local technology company supporting Ashford Wide."
  website: https://example.com
  logo: /images/businesses/timeless-ims.png
```

### Event Front Matter Schema

```yaml
---
title: Christmas Market 2025
date: 2025-12-03
time: "5pm–8pm"
location: Church Road, Ashford
description: "The biggest market of the year during the festive season."
---
```

Hugo’s built-in date logic will automatically sort and filter events, archiving past ones without any manual intervention.

-----

## Phase 3 — Templates & Theme

### Layout Files

|Template                      |Purpose                                                       |
|------------------------------|--------------------------------------------------------------|
|`layouts/index.html`          |Homepage — hero, upcoming events, membership CTA, member logos|
|`layouts/events/list.html`    |Events index, filtering past vs upcoming by date              |
|`layouts/events/single.html`  |Individual event page                                         |
|`layouts/news/list.html`      |News index                                                    |
|`layouts/news/single.html`    |News article                                                  |
|`layouts/_default/single.html`|Catch-all for simple content pages                            |
|`layouts/partials/`           |Header, footer, nav, cookie banner, member grid               |

### CSS

Carry over Bulma via CDN, or use plain CSS/Tailwind processed through Hugo Pipes. Either reduces the plugin and theme maintenance overhead of the current WordPress setup.

### Design Issues to Fix During Migration

- Wire up all footer links (currently all `#` placeholders)
- Fix the Volunteer page slug (currently exposed as `/elementor-15817/`)
- Build the events listing to auto-archive past events by date
- Implement a proper GDPR-compliant cookie consent banner
- Remove the stale Christmas 2024 voting promotion from the homepage

-----

## Phase 4 — Decap CMS Setup

Decap CMS is served at `/admin/` on the site and commits edits directly to GitHub, triggering a Cloudflare Pages rebuild — typically under 30 seconds.

### Authentication

Use Cloudflare Access to protect `/admin/`. The free tier supports up to 50 users, which is ample for a volunteer-run organisation.

### CMS Configuration (`static/admin/config.yml`)

```yaml
backend:
  name: github
  repo: org/ashfordwide
  branch: main

media_folder: static/images/uploads
public_folder: /images/uploads

collections:
  - name: events
    label: Events
    folder: content/events
    create: true
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime }
      - { label: Time, name: time, widget: string }
      - { label: Location, name: location, widget: string }
      - { label: Description, name: body, widget: markdown }

  - name: news
    label: News
    folder: content/news
    create: true
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime }
      - { label: Body, name: body, widget: markdown }

  - name: businesses
    label: Business Directory
    files:
      - label: All Businesses
        name: businesses
        file: data/businesses.yaml
        fields:
          - label: Businesses
            name: businesses
            widget: list
            fields:
              - { label: Name, name: name, widget: string }
              - { label: Category, name: category, widget: string }
              - { label: Description, name: description, widget: text }
              - { label: Website, name: website, widget: string }
              - { label: Logo, name: logo, widget: image }
```

Volunteers interact with a browser-based admin UI and never need to touch Markdown or YAML directly.

-----

## Phase 5 — Third-Party Integrations

|Need              |Solution                                                         |
|------------------|-----------------------------------------------------------------|
|Contact form      |Formspree (free tier — 50 submissions/month)                     |
|Newsletter signup |Existing Mailchimp embed — copy snippet into template            |
|Donation button   |PayPal embed in `support.md` page template                       |
|Cookie consent    |Lightweight custom JS partial (~20 lines), or CookieYes free tier|
|Event voting/forms|Existing Microsoft Forms links work identically                  |

All of these are client-side embeds or external links and are entirely unaffected by the underlying CMS or static site generator.

-----

## Phase 6 — Migration & Launch

1. **Audit and migrate all content** from the live WordPress site — pages, news posts, events, business directory entries, and images
1. **Fix content issues during migration** — remove stale Christmas competition banner, update events list, clear the “coming soon” news placeholder
1. **Redirect mapping** — create a `_redirects` file for Cloudflare Pages to map old WordPress URLs (e.g. `/?p=123`) to new slugs, preserving SEO value and avoiding broken inbound links
1. **Staging review** — use the Cloudflare Pages preview URL for a full review before cutting DNS
1. **DNS cutover** — point `ashfordwide.com` to Cloudflare Pages; configure `www` → apex redirect
1. **Decommission WordPress** — once satisfied, cancel the existing WordPress hosting

-----

## Issues Resolved by This Rebuild

|Issue                           |Resolution                                          |
|--------------------------------|----------------------------------------------------|
|Stale events showing as upcoming|Hugo date logic auto-archives past events           |
|Dead “Latest News” page         |Proper news collection with working list template   |
|Volunteer page Elementor slug   |Clean URL structure defined from the start          |
|Footer placeholder links        |Wired up correctly in the base template             |
|Non-compliant cookie consent    |GDPR-compliant implementation baked into the theme  |
|Performance                     |Cloudflare CDN serving pre-rendered HTML globally   |
|Security                        |No server-side CMS attack surface; static files only|

-----

## Effort Estimate

|Phase                  |Estimated Effort|
|-----------------------|----------------|
|Setup & infrastructure |2–3 hours       |
|Content architecture   |2–3 hours       |
|Templates & theme      |8–15 hours      |
|Decap CMS configuration|2–3 hours       |
|Content migration      |3–5 hours       |
|Testing & launch       |2–3 hours       |
|**Total**              |**~20–30 hours**|

The bulk of time is in the templates. Infrastructure and CMS configuration are relatively mechanical once the content architecture is settled. Achievable for a solo developer over a couple of weekends.