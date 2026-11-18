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

In the CMS, use **Insert → Image** in the Body editor. It gives you fields for the image, alt text and an optional caption, and writes the shortcode for you.

To add a caption, use the `caption` parameter. It's shown under the image and can include Markdown links and bold/italic:

```markdown
{{< image src="/images/foo.jpg" alt="Description" caption="Photo by [Jane Doe](https://example.com)" >}}
```

If the alt text or caption needs a double quote, write it as `\"`. The CMS does this automatically.

Plain Markdown images (`![Description](/images/foo.jpg)`) also go through the image pipeline, but they can't have a caption.

## Choosing a size and shape

If you're making images in Canva, the table below gives the aspect ratio to design at and the minimum size to export for each use case on the site. Treat "minimum export size" as a floor, not just a target — the pipeline will happily scale a smaller image up to fit, which makes it look soft/blurry rather than erroring. Only some use cases are auto-cropped (see the last column); where cropping does happen it's anchored to the centre of the image (the homepage hero is the one exception — see [Homepage hero image](#homepage-hero-image) below), so keep the important subject in the middle of the frame rather than off to one edge.

| Use case | Aspect ratio | Minimum export size | Cropped automatically? |
|---|---|---|---|
| Homepage hero / full-width background | Wide landscape, ~2:1 | 1600×800 | Yes — centre-cropped by default; crop position adjustable via `imagePosition` |
| Event image (default) | 16:9 | 1200×675 | Yes — centre-cropped |
| Event image (`imageAspect: square`) | 1:1 | 1200×1200 | Yes — centre-cropped |
| News article image | 16:9 | 1200×675 | Yes — centre-cropped (no square option for news) |
| Half-width section image | 16:9 | 900×506 | Yes — centre-cropped |
| Generic page feature image | Flexible — shown uncropped, capped at 600px tall on the page | 1200px wide | No — shown at its natural ratio, so pick a shape that already looks right uncropped |
| `{{< image >}}` shortcode (in-body, no extra class) | Whatever suits the content | Match the intended display width | No — shown at natural ratio unless you add your own aspect-ratio class |
| Carousel slide (`{{< carousel >}}`) | Portrait, 3:4 by default; 16:9 with `orientation="horizontal"`; any shape with `orientation="auto"` | 900×1200 (portrait) | Yes, centre-cropped to the frame. With `orientation="auto"` the frame matches the first image, so a set of same-sized images shows uncropped |
| Flag grid (`{{< flag-grid >}}`) | Portrait, ~3:4 | 1200×1600 | Yes — centre-cropped to a fixed display height |
| Business / member logo | Any — square or landscape both work | 500px on the longest side; a transparent-background PNG is recommended | No — letterboxed, never cropped |
| OG / social share image | ~1.91:1 | 1200×630 | No — used exactly as uploaded (not resized or cropped), so export at the final size and ratio |

Business-member profile pages have their own hero banner (16:5, 1400×480) and promo-card (16:9) image sizing — see [docs/editorial/business_pages.md](business_pages.md) rather than duplicating it here.

## Homepage hero image

The homepage hero image isn't editable in the CMS. It's set in the front matter of `content/_index.md`:

```yaml
image: "/images/christmas-tree-2026.jpeg"
imagePosition: "center 4%"
```

- `image` is the photo, stored in `assets/images/`.
- `imagePosition` is optional and controls which part of the photo stays visible when it's cropped. It takes a CSS `background-position` value: `"center 4%"` keeps the top of the photo in view, `"center bottom"` the bottom. If you leave it out, the crop is centred.

The hero is very wide on desktop (up to about 3.7:1) and close to square on phones, so how much gets cropped changes a lot between screens. Check the homepage at desktop, tablet and phone widths after changing either field. The hero also has a 55% dark overlay to keep the heading readable, so bright photos work best.

### Undoing the Christmas tree hero (after Christmas)

For Christmas 2026 the hero uses a portrait photo of the town Christmas tree. Its crop is anchored near the top with `imagePosition: "center 4%"` so the star stays visible. When the season is over:

1. In `content/_index.md`, set `image:` back to the year-round photo: `"/images/home-primary-image.jpg"`.
2. **Delete the `imagePosition:` line.** If you leave it in, the landscape photo will be cropped from the top instead of the centre.
3. Check the homepage on desktop and on a phone before publishing.

`ogImage` in `hugo.toml` (the image used in social media link previews) wasn't changed for Christmas, so there's nothing to undo there.
