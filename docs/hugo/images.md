# Image handling

Images on this site are converted to AVIF at build time by Hugo's asset pipeline. This keeps the source files as familiar JPG/PNG while serving a modern, efficient format to browsers.

## How it works

Hugo can only process images that live in the `/assets/` directory. Images in `/static/` are copied to the output unchanged — Hugo never touches them. All raster images therefore live in `/assets/images/`.

At build time, the `layouts/partials/image.html` partial looks up each image via `resources.Get`, converts it to AVIF (optionally resizing it too), and outputs the processed file's URL. Hugo caches the result in `/resources/_gen/images/`, so repeat builds are fast.

Three files remain in `/static/images/` and are intentionally never processed:

| File | Reason |
|---|---|
| `logo.svg` | Already a vector — no raster conversion needed |
| `favicon.png` | Must be served at a predictable static path |
| `apple-touch-icon.png` | iOS requires a static path for home screen icons |

## The image partial

**`layouts/partials/image.html`** is the single place all image processing goes through. Call it with a dict of parameters:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `src` | string | required | Image path, e.g. `/images/foo.jpg` |
| `alt` | string | `""` | Alt text for the `<img>` tag |
| `class` | string | `""` | CSS class string |
| `loading` | string | `"lazy"` | `"lazy"` or `"eager"` |
| `width` | int | — | If set, resizes to this width (px) and converts to AVIF. If omitted, converts to AVIF at original dimensions. |
| `quality` | int | — | Output quality, 1–100. If omitted, uses the global default from `[imaging]` in `hugo.toml` (Hugo's built-in default is 75). |
| `urlOnly` | bool | `false` | When `true`, returns just the URL string instead of a full `<img>` tag. Used for CSS `background-image` and meta tags. |
| `format` | string | `"avif"` | Output image format/codec passed to Hugo's image processing (e.g. `"avif"`, `"webp"`). Override only if a specific image needs a different format. |

The partial strips any leading `/` from `src` before calling `resources.Get`, so paths from front matter and YAML data files (which conventionally start with `/`) work without any normalisation at the call site.

If `resources.Get` returns nil (file missing, path wrong, or external URL), the partial falls back to the original `src` — the image will be broken but the build won't fail.

### Rendering an img tag

```
{{ partial "image.html" (dict "src" "/images/foo.jpg" "alt" "Description" "class" "w-full rounded") }}
```

### Resizing and converting

```
{{ partial "image.html" (dict "src" "/images/hero.jpg" "alt" "Hero" "class" "w-full" "loading" "eager" "width" 1600) }}
```

### Getting just a URL (for CSS or meta tags)

```
{{- $url := partial "image.html" (dict "src" "/images/hero.jpg" "urlOnly" true "width" 1600) | strings.TrimSpace -}}
style="background-image:url('{{ $url }}')"
```

Use `strings.TrimSpace` when assigning the result to a variable — Hugo partials can include stray whitespace that causes issues inside HTML attributes.

## Quality settings

Hugo's built-in quality default is **75**. You can change this at two levels:

**Site-wide** — add to `hugo.toml`. This applies to every image processed on the site:

```toml
[imaging]
  quality = 80
```

**Per-image** — pass a `quality` param to the partial. This overrides the global default for that specific call:

```
{{ partial "image.html" (dict "src" "/images/hero.jpg" "alt" "Hero" "width" 1600 "quality" 85) }}
```

Lower quality produces smaller files but more visible compression artefacts. Photos can usually tolerate 75–80; logos and graphics with flat colours may look noticeably worse below 80. The global `[imaging]` setting is sufficient for most sites — per-call overrides are only worth it if specific images need different treatment.

## Adding a new image

1. Place the file in `/assets/images/` (or a subdirectory, e.g. `/assets/images/events/`)
2. Reference it in your template or front matter using the `/images/...` path as normal — the partial handles the rest

There is no step 3. You do not need to change any config or register the image anywhere.

## Adding images to content (news, events)

Set the `image` front matter key to the `/images/...` path:

```yaml
---
title: "Spring Market"
date: 2026-05-10
image: /images/events/spring-market.jpg
---
```

The news and events templates (`layouts/news/single.html`, `layouts/events/single.html`, etc.) automatically process the image through the partial. The same path is used for the OG image and JSON-LD structured data — both will also point to the processed AVIF.

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

## Adding images to a new layout file

Call the partial the same way as anywhere else:

```
{{ partial "image.html" (dict "src" "/images/my-image.jpg" "alt" "My image" "class" "w-full") }}
```

No imports or setup needed — Hugo partials are globally available.

**From Markdown content** — use the `{{< image >}}` shortcode instead, a thin wrapper around the same partial:

```markdown
{{< image src="/images/foo.jpg" alt="Description" class="w-full rounded" >}}
```

For data-driven images where the path comes from a YAML field (like business logos), pass the field value directly:

```
{{ partial "image.html" (dict "src" .logo "alt" .name "class" "h-12 w-auto") }}
```

## Choosing a width

Specifying `width` resizes the image to that pixel width (maintaining aspect ratio) in addition to converting to AVIF. This is worth doing for large images — it prevents a 4000px source being served at display widths of 400px.

Rough guidelines used on this site:

| Use case | width param |
|---|---|
| Full-width hero / background | 1600 |
| Article feature image | 1200 |
| Half-width section image | 900 |
| OG / social share image | — (convert only, keep original dimensions) |
| Business / member logos | 300 |
| Small icons | — (convert only) |

For the hero `background-image` and its `<link rel="preload">`, both must use the **same `width` value** — if they differ, Hugo generates two separate files and the preload will not match the image that actually loads.

## Build cache

Hugo saves processed images to `/resources/_gen/images/`. This directory is committed to the repository so that Cloudflare Pages doesn't need to re-process every image on each deploy. If you add or replace source images, the new AVIF variants will be generated on the next build and should be committed alongside the source files.

To clear the cache and force a full rebuild of all images:

```bash
hugo --gc
```
