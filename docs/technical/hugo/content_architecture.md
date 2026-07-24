# Content Architecture

## Content Types

```
content/
├── _index.md
├── about.md
├── aed-locations.md                 # Defibrillator locations — uses the aed-map shortcode
├── business-directory.md            # Uses layout: "business-directory"
├── business-lamppost-banners.md
├── contact.md
├── current-sponsorship-opportunities.md
├── data.md                          # Cookies / privacy policy page
├── membership.md
├── safeguarding.md                  # Uses `param "safeguardingEmail"` for the DSL contact address
├── sponsorship.md
├── stallholders.md                  # draft: true — not published
├── support.md                       # Uses the paypal-donate shortcode
├── town-flags.md                    # Uses the flag-grid shortcode
├── volunteer.md
├── events/
│   ├── _index.md
│   ├── past.md                      # Renders /events/past/ archive page; excluded from page lists
│   ├── 2022/
│   ├── 2023/
│   ├── 2024/
│   ├── 2025/
│   └── 2026/                        # Each year folder holds that year's event pages
├── news/
│   ├── _index.md
│   ├── 2014/
│   ├── 2015/
│   ├── 2016/
│   ├── 2017/
│   ├── 2019/
│   ├── 2022/
│   ├── 2025/
│   └── 2026/
└── remembrance-day/
    ├── _index.md                        # Uses layout: single — suppresses default child-page card grid
    ├── order-of-service.md
    ├── road-closures.md                 # Uses the road-closure-map shortcode — see docs/technical/remembrance_map.md
    ├── sponsor-a-poppy.md
    └── virtual-poppy-wall.md
```

> [!NOTE]
> This tree lists real top-level pages and folders as of writing. Exact filenames inside `events/<year>/` and `news/<year>/` change often as new content is added — check the folder directly rather than relying on a filename list here.

> [!CAUTION]
> `content/business-member/` is referenced by `layouts/business-member/single.html` and by [docs/editorial/business_pages.md](../../editorial/business_pages.md), but the folder currently contains no pages — no business has a dedicated profile page today. The business directory (`content/business-directory.md`, driven by `data/businesses.yaml`) is the only business listing currently live on the site.

## Year Subdirectory Organisation

Both `content/news/` and `content/events/` organise files into year subdirectories (`2025/`, `2026/`, etc.) without affecting public URLs. This is achieved via the [`permalinks`](https://gohugo.io/configuration/permalinks/) config (see above). Adding new content to the correct year folder requires no other changes — the URL is always derived from the filename alone.

## `content/events/past.md`

This file exists solely to generate the `/events/past/` archive page using `layouts/events/past.html`. It is excluded from all Hugo page collections via:

```yaml
build:
  list: never
  render: always
```
> [!CAUTION]
> Do not delete this file — the `/events/past/` URL depends on it.

## Front Matter

Field-by-field front matter references for events, news, and standard pages live in [docs/editorial/front_matter_reference.md](../../editorial/front_matter_reference.md).

## Atom Feeds

The site has Atom 1.0 feeds built automatically at the same URLs previously used for RSS, one per section plus the site-wide feed:

- `/index.xml` - Site-wide feed
- `/events/index.xml` - Events feed
- `/news/index.xml` - News feed
- `/tags/index.xml` - Tags taxonomy feed
- `/remembrance-day/index.xml` - Remembrance Day section feed

Hugo's RSS output format is used internally (keeping URLs as `index.xml`), but the template at `layouts/_default/rss.xml` outputs valid Atom 1.0 XML. The autodiscovery `<link>` in `head.html` uses `type="application/atom+xml"`.
