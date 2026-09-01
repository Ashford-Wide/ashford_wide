# Front Matter Reference

Full reference: [Hugo front matter](https://gohugo.io/content-management/front-matter/)

Field-by-field reference for the front matter of each content type. For a quick summary and pointers back to this file, see [docs/editorial/markdown_shortcodes.md](markdown_shortcodes.md#common-front-matter-fields).

## Event Front Matter

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
cancelled: true             # optional — defaults to false; marks the event as cancelled
eventStatus: EventCancelled # optional — overrides default EventScheduled
attendanceMode: OnlineEventAttendanceMode  # optional — overrides default OfflineEventAttendanceMode
freeEvent: true              # optional — defaults to false; marks the event as free in the schema.org output
publishDate: 2026-06-01      # optional — used as offers.validFrom when freeEvent is true; defaults to `date` if omitted
performer: true              # optional — defaults to false; adds a `performer` to the schema.org output, same value as `organizer`
---
```

To find a Place ID, use the official [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) tool — search for the venue and copy the ID from the result.

The `date` field drives all event filtering. The events list template splits events into upcoming (`date >= now`) and past (`date < now`) automatically. No manual archiving is needed.

`startTime` and `endTime` are stored as `HH:MM` 24hr strings. The `layouts/partials/event-time.html` partial formats them for display (e.g. `10am–3pm`). They are also combined with `date` to produce ISO-8601 datetime values in the schema.org JSON-LD output (e.g. `2026-07-11T10:00`).

`cancelled: true` is the simplest way to mark an event as cancelled — it shows a "Cancelled" badge on the event page and in event listings, and overrides `eventStatus` to `EventCancelled` in the schema.org output. Use `eventStatus` directly instead if the event is postponed or rescheduled rather than cancelled.

`eventStatus` accepts values defined by [Schema.org/EventStatusType](https://schema.org/EventStatusType) (e.g. `EventScheduled`, `EventCancelled`, `EventPostponed`, `EventRescheduled`).

`attendanceMode` accepts values defined by [Schema.org/EventAttendanceModeEnumeration](https://schema.org/EventAttendanceModeEnumeration) (e.g. `OfflineEventAttendanceMode`, `OnlineEventAttendanceMode`, `MixedEventAttendanceMode`).

`freeEvent: true` adds an `offers` object to the schema.org output with `price: "0"`, `priceCurrency: "GBP"`, and `availability: https://schema.org/InStock` — use it for events that are free to attend and require no ticketing. Not yet exposed as a field in the Sveltia CMS editor; add it directly in the Markdown front matter.

`offers.validFrom` is set from Hugo's standard `publishDate` field — set `publishDate` to the date the event was announced/published if you want this accurate; if omitted, it falls back to `date` (the event date itself).

`performer: true` adds a `performer` object to the schema.org output, set to the same value as `organizer` (i.e. `organiser`/`organiserUrl` if set, otherwise Ashford Wide). Not yet exposed as a field in the Sveltia CMS editor; add it directly in the Markdown front matter.

## News Front Matter

```yaml
---
title: "Spring Events Programme Announced"
date: 2026-03-15
author: "Ashford Wide Team"
description: "Short summary shown on news cards."
image: "/images/news/spring-events.jpg"  # optional
---
```

## Standard Page Front Matter

```yaml
---
title: "Page Title"
description: "Used in <meta name='description'> and page header subtitle."
layout: "business-directory"  # optional — overrides the default template
---
```
