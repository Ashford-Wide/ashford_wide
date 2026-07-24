# Adding images to content

Images referenced from content are automatically converted to AVIF and optionally resized at build time — you don't need to do any conversion yourself. See [docs/technical/hugo/images.md](../technical/hugo/images.md) for how the pipeline works.

## Adding images to content (news, events)

Set the `image` front matter key to the `/images/...` path:

```yaml
---
title: "Spring Market"
date: 2026-05-10
image: /images/events/spring-market.jpg
---
```

The news and events templates automatically process the image through the site's image pipeline. The same path is used for the OG image and JSON-LD structured data — both will also point to the processed AVIF.

### Event image aspect ratio

Event images default to a 16:9 crop. To display the image square instead, add `imageAspect: square` to the event's front matter:

```yaml
---
title: "Reading Between the Lines"
date: 2026-05-16
image: /images/events/reading-between-the-lines-2026.jpg
imageAspect: square
---
```

Omitting `imageAspect` (or setting any other value) falls back to 16:9.

## The `{{< image >}}` shortcode

To insert an image directly in the Markdown body of a page, use the `{{< image >}}` shortcode:

```markdown
{{< image src="/images/foo.jpg" alt="Description" class="w-full rounded" >}}
```

## Choosing a width

Rough guidelines used on this site for the image's target display width:

| Use case | width param |
|---|---|
| Full-width hero / background | 1600 |
| Article feature image | 1200 |
| Half-width section image | 900 |
| OG / social share image | — (convert only, keep original dimensions) |
| Business / member logos | 300 |
| Small icons | — (convert only) |
