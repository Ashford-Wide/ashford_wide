# SEO

## Schema.org / JSON-LD

Two or three JSON-LD blocks are output per page:

| Partial | Output on | Type |
|---------|-----------|------|
| `partials/jsonld/org.html` | Every page (via `head.html`) | [`Organization`](https://schema.org/Organization) |
| `partials/jsonld/article.html` | News single pages (via `head_extra` in `news/single.html`) | [`NewsArticle`](https://schema.org/NewsArticle) |
| `partials/jsonld/event.html` | Event single pages (via `head_extra`) | [`Event`](https://schema.org/Event) |
| `partials/jsonld/webpage.html` | Default single pages, business member pages, and the virtual poppy wall (via `head_extra`) | [`WebPage`](https://schema.org/WebPage) |
| `partials/jsonld/business-directory.html` | The business directory page | [`CollectionPage`](https://schema.org/CollectionPage) / [`ItemList`](https://schema.org/ItemList) of [`LocalBusiness`](https://schema.org/LocalBusiness) |

> [!NOTE]
> A fifth file, `partials/jsonld/closures.html`, exists in the repo but isn't called from any template — it's dead code from an earlier version of the road closures page. See [docs/known_gaps_future_work.md](known_gaps_future_work.md).

### Organisation JSON-LD fields

Output on every page via `partials/jsonld/org.html`.

| Field | Source | Notes |
|-------|--------|-------|
| `@id` | `baseURL` | `#organization` appended to the site's base URL — stable graph node identifier |
| `@type` | hardcoded | `Organization` |
| `additionalType` | hardcoded | [Wikidata Q5154974](https://www.wikidata.org/wiki/Q5154974) — community interest company |
| `name` | `site.Title` | |
| `legalName` | `params.legalName` | |
| `url` | `baseURL` | Trailing slash stripped |
| `description` | `params.description` | Omitted if blank |
| `logo` | `params.logo` | Absolute URL, processed through the image pipeline — omitted if blank |
| `foundingDate` | `params.foundingDate` | Omitted if blank |
| `email` | `params.email` | Omitted if blank |
| `identifier` | `params.companyNumber` | `PropertyValue` with a Companies House URL — entire block omitted if blank |
| `companyRegistration` | `params.companyNumber` | Same value as `identifier.value`, set alongside it — omitted if blank |
| `knowsAbout` | hardcoded | Community Development ([Wikidata Q5154974](https://www.wikidata.org/wiki/Q5154974)) |
| `areaServed` | hardcoded + generated | A `City` node (Ashford, [Wikidata Q725270](https://www.wikidata.org/wiki/Q725270)) plus a `GeoShape` polygon computed at build time from `assets/geo/ashford.geojson` |
| `sameAs` | `params.facebook`, `.twitter`, `.instagram`, `.googleBusinessProfile`, plus the Companies House URL if `companyNumber` is set | Omitted entirely if none are present |
| `contactPoint` | `params.email` | `ContactPoint` with `contactType: "Contact email"` — omitted if `email` is blank |
| `potentialAction` | hardcoded + `baseURL` | `DonateAction` with `recipient` set to the org and `target` pointing to `/support/` |

There is no `slogan`, `telephone`, or `address` field in the Organization JSON-LD, and no matching `slogan`/`phone`/`address.*` params exist in `hugo.toml` — the organisation's postal address is not currently exposed as structured data anywhere on the site.

### NewsArticle JSON-LD fields

Full reference: [Schema.org/NewsArticle](https://schema.org/NewsArticle)

Output on news single pages via `partials/jsonld/article.html`, included through `head_extra` in `layouts/news/single.html`.

| Field | Source | Notes |
|-------|--------|-------|
| `@type` | hardcoded | `NewsArticle` |
| `headline` | `.Title` | |
| `datePublished` | `.Date` | ISO-8601 datetime |
| `dateModified` | `.Lastmod` | ISO-8601 datetime — falls back to `.Date` if `lastmod` not set in front matter |
| `url` | `.Permalink` | |
| `wordCount` | `.WordCount` | Computed by Hugo |
| `publisher` | Site config | `Organization` with name and URL from `hugo.toml` |
| `author` | `author` param or site config | Defaults to the site `Organization`; if `author` front matter is set, outputs an `Organization` node with that name instead (not a `Person` — the field is used for things like "Ashford Wide Team", not individual bylines) |
| `description` | `.Description` | Omitted if blank |
| `image` | `image` param | Absolute URL — omitted if not set |

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
| `location.hasMap` / `location.sameAs` | `placeId` param | Google Maps search URL built from `location` + `placeId` — omitted if `placeId` not set |
| `description` | `.Description` | |
| `image` | `image` param | Absolute URL |
| `url` | `.Permalink` | |
| `organizer` | `organiser`/`organiserUrl` params, else site config | If `organiser` front matter is set, outputs that name (with `organiserUrl` as its `url` if also set) instead of the default Ashford Wide `Organization` |

### WebPage JSON-LD fields

Full reference: [Schema.org/WebPage](https://schema.org/WebPage)

Output on default single pages (about, support, volunteer, membership, etc.), business member pages, and the virtual poppy wall via `partials/jsonld/webpage.html`. Pages under `news/` and `events/` use their own specific types and are unaffected.

| Field | Source | Notes |
|-------|--------|-------|
| `@type` | hardcoded | `WebPage` |
| `name` | `.Title` | |
| `url` | `.Permalink` | |
| `inLanguage` | `.Site.Language.Locale` | `en-GB`, from the `locale` key in `hugo.toml` |
| `wordCount` | `.WordCount` | Computed by Hugo |
| `publisher` | Site config | Name and URL from `hugo.toml` |
| `copyrightHolder` | `params.legalName` | `Organization` node |
| `description` | `.Description` | Omitted if blank |
| `datePublished` | `date` front matter | ISO-8601 — omitted if not set |
| `dateModified` | `lastmod` front matter | ISO-8601 — omitted if not set |
| `lastReviewed` | `lastmod` front matter | Date only (`YYYY-MM-DD`) — omitted if `lastmod` not set |
| `image` | `image` param | Absolute URL, processed through the image pipeline — omitted if not set |

To enable date fields on a page, add `date` and `lastmod` to its front matter:

```yaml
date: 2024-01-01
lastmod: 2026-04-06
```

### Team microdata

The About page team list (`layouts/shortcodes/team.html`) annotates each person with HTML microdata using [Schema.org `Person`](https://schema.org/Person):

| Attribute | Element | Property |
|---|---|---|
| `itemscope itemtype="https://schema.org/Person"` | `<li>` | declares the entity |
| `itemprop="name"` | `<strong>` | person's name |
| `itemprop="jobTitle"` | `<span>` | role/title |
| `itemprop="sameAs"` | each social `<a>` | links to their identity on LinkedIn, Instagram, Facebook, Twitter |

Team data is sourced from `data/team.yaml`. Social profile links are optional per person.

### SUPPORT US microdata

The SUPPORT US button is annotated with HTML microdata using [Schema.org `DonateAction`](https://schema.org/DonateAction):

```html
<div itemprop="potentialAction" itemscope itemtype="https://schema.org/DonateAction">
  <a itemprop="url" href="/support" ...>SUPPORT US</a>
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

The default OG image (`/images/og-default.jpg`) should be 1200×630px and under 600KB ([Facebook: Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images/) & [WhatsApp: Link Previews](https://developers.facebook.com/documentation/business-messaging/whatsapp/link-previews/)).