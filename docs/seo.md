# SEO

## Schema.org / JSON-LD

Two or three JSON-LD blocks are output per page:

| Partial | Output on | Type |
|---------|-----------|------|
| `partials/jsonld/org.html` | Every page (via `head.html`) | [`Organization`](https://schema.org/Organization) |
| `partials/jsonld/event.html` | Event single pages (via `head_extra`) | [`Event`](https://schema.org/Event) |
| `partials/jsonld/webpage.html` | Default single pages (via `head_extra` in `_default/single.html`) | [`WebPage`](https://schema.org/WebPage) |

### Organisation JSON-LD fields

Output on every page via `partials/jsonld/org.html`.

| Field | Source | Notes |
|-------|--------|-------|
| `@id` | `baseURL` | `https://ashfordwide.com/#organization` — stable graph node identifier |
| `@type` | hardcoded | `Organization` |
| `additionalType` | hardcoded | [Wikidata Q5154974](https://www.wikidata.org/wiki/Q5154974) — community interest company |
| `name` | `site.Title` | |
| `legalName` | `params.legalName` | |
| `url` | `baseURL` | Trailing slash stripped |
| `description` | `params.description` | Omitted if blank |
| `logo` | `params.logo` | Absolute URL — omitted if blank |
| `foundingDate` | `params.foundingDate` | Omitted if blank |
| `slogan` | `params.slogan` | Omitted if blank |
| `email` | `params.email` | Omitted if blank |
| `telephone` | `params.phone` | Omitted if blank |
| `identifier` | `params.companyNumber` | `PropertyValue` with Companies House URL — entire block omitted if blank |
| `address` | `params.address.*` + hardcoded | `PostalAddress` — locality Ashford, region Surrey, country GB |
| `knowsAbout` | hardcoded | Community Development ([Wikidata Q5154974](https://www.wikidata.org/wiki/Q5154974)) |
| `areaServed` | hardcoded | City: Ashford ([Wikidata Q725270](https://www.wikidata.org/wiki/Q725270)); DefinedRegion: TW15 |
| `sameAs` | `params.facebook`, `.twitter`, `.instagram` | Omitted entirely if none are set |
| `contactPoint` | `params.email` | `ContactPoint` with `contactType: "Contact email"` — omitted if `email` is blank |
| `potentialAction` | hardcoded + `baseURL` | `DonateAction` with `recipient` set to the org and `target` pointing to `/support/` |

### Event JSON-LD fields

Full reference: [Schema.org/Event](https://schema.org/Event)

| Field | Source | Notes |
|-------|--------|-------|
| `name` | `.Title` | |
| `startDate` | `date` + `startTime` | ISO-8601 — `2026-07-11T10:00` if time set, `2026-07-11` otherwise |
| `endDate` | `date` + `endTime` | Only output if `endTime` is set |
| `eventStatus` | `eventStatus` param | Defaults to `EventScheduled` — see [EventStatusType](https://schema.org/EventStatusType) |
| `eventAttendanceMode` | `attendanceMode` param | Defaults to `OfflineEventAttendanceMode` — see [EventAttendanceModeEnumeration](https://schema.org/EventAttendanceModeEnumeration) |
| `location.name` | `location` param | |
| `location.address` | Always set | Locality/region hardcoded to Ashford, Surrey, GB; `streetAddress` from `address` param if set |
| `description` | `.Description` | |
| `image` | `image` param | Absolute URL |
| `url` | `.Permalink` | |
| `organizer` | Site config | Name and URL from `hugo.toml` |

### WebPage JSON-LD fields

Full reference: [Schema.org/WebPage](https://schema.org/WebPage)

Output on default single pages (about, support, volunteer, membership, etc.) via `partials/jsonld/webpage.html`. Pages under `news/` and `events/` use their own specific types and are unaffected.

| Field | Source | Notes |
|-------|--------|-------|
| `@type` | hardcoded | `WebPage` |
| `name` | `.Title` | |
| `url` | `.Permalink` | |
| `inLanguage` | `.Site.LanguageCode` | `en-GB` |
| `publisher` | Site config | Name and URL from `hugo.toml` |
| `description` | `.Description` | Omitted if blank |
| `datePublished` | `date` front matter | ISO-8601 — omitted if not set |
| `dateModified` | `lastmod` front matter | ISO-8601 — omitted if not set |
| `lastReviewed` | `lastmod` front matter | Date only (`YYYY-MM-DD`) — omitted if `lastmod` not set |

To enable date fields on a page, add `date` and `lastmod` to its front matter:

```yaml
date: 2024-01-01
lastmod: 2026-04-06
```

### SUPPORT US microdata

The SUPPORT US button is annotated with HTML microdata using [Schema.org `DonateAction`](https://schema.org/DonateAction):

```html
<div itemprop="potentialAction" itemscope itemurl="https://schema.org/DonateAction">
  <a itemprop="target" href="/support" ...>SUPPORT US</a>
</div>
```

## Open Graph & Social Previews

All pages output [Open Graph](https://ogp.me/) and [Twitter/X Card](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) meta tags via `layouts/partials/opengraph.html`, included from `head.html`.

### Image priority

1. Page-level `image:` frontmatter param (news/events)
2. `site.Params.ogImage` — the site-wide default (`/images/og-default.jpg`)

### `og:type` by section

- `article` — news pages (also outputs `article:published_time` and `article:author`)
- `website` — all other pages

**`twitter:card`** is set to `summary_large_image` when an image is available, otherwise `summary`.

The default OG image (`/images/og-default.jpg`) should be **1200×630px** — ideally the Ashford Wide logo on a branded background. This file does not yet exist and needs to be created.