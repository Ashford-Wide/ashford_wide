# Remembrance Day order of service

The full Remembrance Sunday liturgy is published as accessible HTML at `/remembrance-day/order-of-service/`, sourced from `content/remembrance-day/order-of-service.md` and rendered through a dedicated template, `layouts/remembrance-day/order-of-service.html`. It replaced an earlier short outline + PDF-only version of this page — the page now carries the complete text (every prayer, reading, hymn, and congregational response) instead of just a summary.

The page still links out to `static/documents/2025-OoS.pdf` via a **Download PDF** button in the hero, for anyone who wants a printable copy for the day itself.

> [!NOTE]
> Sveltia CMS is not yet fully wired up for this page's liturgy body — `static/admin/config.yml` tracks `order-of-service.md` as a standard Markdown page, but the call-and-response structure below can only be edited by hand (see next section), not through the `/admin/` rich text editor.

## Why it isn't plain Markdown

The liturgy has structural patterns plain Markdown can't express — call-and-response pairs (a leader's line followed by a bold "All" response), stage directions like *At ease* or *Parade Up*, and centred hymn verses. There's no Markdown syntax for any of that, so the whole body of `order-of-service.md` (below the front matter) is hand-written HTML. Hugo already allows raw HTML in Markdown content — this isn't new to this page.

A small set of reusable CSS classes handles the recurring patterns, so each line only needs one class rather than a long string of utilities repeated everywhere. They're defined in `assets/css/main.css` under `@layer components`:

| Class | Used for |
|-------|----------|
| `liturgy-speaker` | The italic "who's speaking" line (e.g. *Minister*, *Douglas, Ashford Wide.*) |
| `liturgy-line` | A regular spoken line |
| `liturgy-plain` | A plain, unstyled line with no left indent — used for short stage-direction lists (e.g. *The Last Post* / *Silence* / *Reveille*) that read as normal text rather than italic rubric |
| `liturgy-response` + `liturgy-response-label` | A congregational response — wrap the paragraph in `liturgy-response`, and put `All` in a nested `<span class="liturgy-response-label">` before the bold response text |
| `liturgy-rubric` | A stage direction / instruction, right-aligned and muted (*At ease*, *Parade Up*) |
| `liturgy-hymn` | Wraps a block of centred hymn verses (one `<p>` per verse, `<br>` between lines) |
| `liturgy-prayer` | Wraps a centred, bold block — used for the Lord's Prayer |

Each section of the liturgy is wrapped in its own `<section>` with a `##` Markdown heading — these render as `<h2>`s under the page's single `<h1>` title, so the page has a proper heading outline for screen readers even though the surrounding markup is hand-written HTML.

## Editing the liturgy text

To change wording, add a response, or reorder something: edit the HTML directly in `content/remembrance-day/order-of-service.md`, reusing the classes above. Example of one full call-and-response exchange:

```html
<p class="liturgy-speaker">Minister</p>

<p class="liturgy-line">Will you strive for all that makes for peace?</p>

<p class="liturgy-response"><span class="liturgy-response-label">All</span> <strong>We will</strong></p>
```

And a hymn verse block:

```html
<div class="liturgy-hymn">
<p>
O God, our help in ages past,<br>
our hope for years to come,<br>
our shelter from the stormy blast,<br>
and our eternal home:
</p>
</div>
```

Keep a blank line before and after each raw HTML block (including the opening/closing `<section>` tags) — without it, Hugo's Markdown renderer won't recognise the `##` heading inside as a real heading.

## Updating for next year

Each year's service is broadly the same shape but the PDF (`static/documents/2025-OoS.pdf`) gets replaced with a new dated file. When that happens:

1. Add the new PDF to `static/documents/` (e.g. `2026-OoS.pdf`).
2. Update the hardcoded PDF `href` in `layouts/remembrance-day/order-of-service.html`.
3. Compare the new PDF against the existing page section-by-section and edit any wording, response, or ordering changes directly in the HTML.
4. Bump `lastmod` in the front matter.

## Front matter — `order-of-service.md`

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Page title, shown as the `<h1>` in the hero band |
| `description` | No | Not shown on the page itself — used only for the `<meta name="description">` tag and social share previews |
| `layout` | Yes | Must be `order-of-service` — selects `layouts/remembrance-day/order-of-service.html` |
| `date` / `lastmod` | Yes | Standard Hugo dates; `lastmod` should be bumped whenever the text changes |

Everything after the front matter is the liturgy body described above.

## Verifying changes

- `hugo server` and check the page renders as expected at `/remembrance-day/order-of-service/`.
- `npm run test:a11y` — runs a full build and a WCAG 2.2 AA accessibility scan across every page automatically; no manual URL registration needed.
