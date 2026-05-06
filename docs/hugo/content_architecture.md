# Content Architecture

## Content Types

```
content/
├── _index.md
├── about.md
├── business-directory.md            # Uses layout: "business-directory"
├── business-membership.md
├── contact.md                       # Contains raw HTML Formspree form
├── membership.md
├── support.md                       # Contains raw HTML PayPal donation embed
├── volunteer.md
├── events/
│   ├── _index.md
│   ├── past.md                      # Renders /events/past/ archive page; excluded from page lists
│   ├── 2022/
│   │   └── jubilee-picnic-park.md
│   ├── 2025/
│   │   ├── christmas-market-2025.md
│   │   ├── classic-car-show-2025.md
│   │   └── remberance-sunday-2025.md
│   └── 2026/
│       ├── ritual-sacrifice.md
│       ├── spring-festival-2026.md
│       └── summer-market-2026.md
├── news/
│   ├── _index.md
│   ├── welcome-to-ashford-wide.md
│   ├── 2014/
│   ├── 2015/
│   ├── 2016/
│   ├── 2017/
│   ├── 2019/
│   ├── 2022/
│   ├── 2025/
│   └── 2026/
└── remembrance/
    ├── _index.md                        # Uses layout: single — suppresses default child-page card grid
    ├── order-of-services.md
    ├── sponsor-a-poppy.md
    └── virtual-poppy-wall.md
```

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

### Event Front Matter

Full reference: [Hugo front matter](https://gohugo.io/content-management/front-matter/)

```yaml
---
title: "Summer Market 2026"
date: 2026-07-11
startTime: "10:00"          # 24hr HH:MM — optional
endTime: "15:00"            # 24hr HH:MM — optional
location: "High Street, Ashford"
placeId: "ChIJM1ghw1RxdkgRvHav7GUCS60"  # optional — Google Maps Place ID, adds a maps link icon next to location
address: "High Street"      # Street address — optional, added to schema.org output
organiser: "Surrey County Council"        # optional — name of organising body if not Ashford Wide
organiserUrl: "https://example.com"       # optional — link for the organiser, shown as icon next to their name
description: "Short summary shown on event cards and in meta tags."
image: "/images/events/summer-market-2026.jpg"  # optional
endDate: "2026-07-12"       # optional — only for multi-day events
eventStatus: EventCancelled # optional — overrides default EventScheduled
attendanceMode: OnlineEventAttendanceMode  # optional — overrides default OfflineEventAttendanceMode
---
```

To find a Place ID, use the official [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) tool — search for the venue and copy the ID from the result.

The `date` field drives all event filtering. The events list template splits events into upcoming (`date >= now`) and past (`date < now`) automatically. No manual archiving is needed.

`startTime` and `endTime` are stored as `HH:MM` 24hr strings. The `layouts/partials/event-time.html` partial formats them for display (e.g. `10am–3pm`). They are also combined with `date` to produce ISO-8601 datetime values in the schema.org JSON-LD output (e.g. `2026-07-11T10:00`).

`eventStatus` accepts values defined by [Schema.org/EventStatusType](https://schema.org/EventStatusType) (e.g. `EventScheduled`, `EventCancelled`, `EventPostponed`, `EventRescheduled`).

`attendanceMode` accepts values defined by [Schema.org/EventAttendanceModeEnumeration](https://schema.org/EventAttendanceModeEnumeration) (e.g. `OfflineEventAttendanceMode`, `OnlineEventAttendanceMode`, `MixedEventAttendanceMode`).

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

## Atom Feeds

The site has three Atom 1.0 feeds built automatically at the same URLs previously used for RSS:

- `/index.xml` - Site-wide feed
- `/events/index.xml` - Events feed
- `/news/index.xml` - News feed

Hugo's RSS output format is used internally (keeping URLs as `index.xml`), but the template at `layouts/_default/rss.xml` outputs valid Atom 1.0 XML. The autodiscovery `<link>` in `head.html` uses `type="application/atom+xml"`.
