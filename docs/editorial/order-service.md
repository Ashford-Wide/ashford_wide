# Remembrance Day order of service

There are two separate pages covering the Remembrance Sunday order of service:

| Page | File | URL | Purpose |
|------|------|-----|---------|
| Overview | `content/remembrance-day/order-of-service.md` | `/remembrance-day/order-of-service/` | Short outline (the numbered running order), a "Getting There" section with the War Memorial location, and a **Download PDF** button linking to the printable order of service. |
| Full text | `content/remembrance-day/oos.md` | `/remembrance-day/order-of-service-full/` | The complete liturgy — every prayer, reading, hymn, and congregational response — as readable, accessible HTML, for anyone who'd rather not open a PDF. |

The two pages link to each other: the overview page has a "Read the full order of service online" link, and the full-text page has a "Back to Order of Service overview" link plus its own copy of the PDF download button.

This document covers the **full text** page. For the overview page, see [docs/editorial/front_matter_reference.md](front_matter_reference.md) — it's a standard page with no special template.

> [!NOTE]
> Sveltia CMS is not yet wired up for the full-text page — it's not in `static/admin/config.yml`, so it can only be edited by hand-editing `content/remembrance-day/oos.md` in a Git checkout, not through the `/admin/` editor.

## Why it isn't a normal content page

The liturgy has a lot of structural patterns that plain Markdown can't express — call-and-response pairs (a leader's line followed by a bold "All" response), stage directions like *At ease* or *Parade Up*, and centred hymn verses. There's no way to write those with Markdown syntax, so the whole body of `oos.md` is hand-written HTML (Hugo already allows raw HTML in Markdown content — this isn't new to this page).

A small set of reusable CSS classes handles the recurring patterns, so each line only needs one class rather than a long string of utilities repeated everywhere. They're defined in `assets/css/main.css` under `@layer components`:

| Class | Used for |
|-------|----------|
| `liturgy-speaker` | The italic "who's speaking" line (e.g. *Minister*, *Douglas, Ashford Wide.*) |
| `liturgy-line` | A regular spoken line |
| `liturgy-response` + `liturgy-response-label` | A congregational response — wrap the paragraph in `liturgy-response`, and put `All` in a nested `<span class="liturgy-response-label">` before the bold response text |
| `liturgy-rubric` | A stage direction / instruction, right-aligned and muted (*At ease*, *Silence*, *The Last Post*, *Parade Up*, *(Observation of a short silence)*) |
| `liturgy-hymn` | Wraps a block of centred hymn verses (one `<p>` per verse, `<br>` between lines) |
| `liturgy-prayer` | Wraps a centred, bold block — used for the Lord's Prayer |

Each section of the liturgy is wrapped in its own `<section>` with a `##` Markdown heading — these render as `<h2>`s under the page's single `<h1>` title, so the page has a proper heading outline for screen readers even though the surrounding markup is hand-written HTML.

## Editing the liturgy text

To change wording, add a response, or reorder something: edit the HTML directly in `content/remembrance-day/oos.md`, reusing the classes above. Example of one full call-and-response exchange:

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
2. Update the `href` on both **Download PDF** buttons — one in `content/remembrance-day/order-of-service.md` (via the `doc-button` shortcode), one hardcoded in `layouts/remembrance-day/order-of-service.html`.
3. Compare the new PDF against the existing `oos.md` section-by-section and edit any wording, response, or ordering changes directly in the HTML.
4. Bump `lastmod` in both pages' front matter.

## Front matter — `oos.md`

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Page title, shown as the `<h1>` in the hero band |
| `description` | No | Not shown on the page itself — used only for the `<meta name="description">` tag and social share previews |
| `layout` | Yes | Must be `order-of-service` — selects `layouts/remembrance-day/order-of-service.html` |
| `date` / `lastmod` | Yes | Standard Hugo dates; `lastmod` should be bumped whenever the text changes |
| `slug` | Yes | Set to `order-of-service-full` so the page resolves to `/remembrance-day/order-of-service-full/` rather than the default `/remembrance-day/oos/` (Hugo derives the URL from the filename unless `slug` overrides it) |

Everything after the front matter is the liturgy body described above.

## Verifying changes

- `hugo server` and check the page renders as expected, and both cross-links between the two pages resolve.
- `npm run test:a11y` — runs a full build and a WCAG 2.2 AA accessibility scan across every page automatically; no manual URL registration needed.
