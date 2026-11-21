# CSS & Styling (Tailwind CSS v4)

Full reference: [Tailwind CSS docs](https://tailwindcss.com/docs/)

## Setup & Workflow

- **Dependencies**: Tailwind CSS is built via PostCSS and `postcss-cli` using Hugo Pipes. `@tailwindcss/typography` (markdown prose styling) and `daisyui` are also installed. All of these are build-time `devDependencies`. An `npm install` is required after cloning the repo.
- **daisyui**: loaded in `main.css` via `@plugin "daisyui" { themes: false; include: carousel; }`. Only its `carousel`/`carousel-item` classes are used (in `layouts/shortcodes/carousel.html`), so `include: carousel` stops it emitting every other component (`btn`, `card`, `alert`, …) and its global base styles. If you need another daisyUI component, add it to the `include` list. Without the `include`, daisyUI also rewrote the typography plugin's prose colours to an undefined theme variable.
- **Entry point**: `assets/css/main.css` — contains all `@theme` tokens, `@keyframes`, and `@layer components` classes.
- **Content sources**: `@import "tailwindcss" source(none)` turns off automatic file detection, and `@source` lines list the only folders scanned for class names: `layouts`, `content` and `assets/js`. The paths are relative to the **project root**, not to `main.css`, because Hugo Pipes runs PostCSS from there. Without this, Tailwind also scanned `docs/` and generated CSS for classes that only appear in documentation. If you start writing class names somewhere new (e.g. `data/`), add an `@source` line for it.
- **Hugo integration**: Included in `layouts/partials/head.html` via `resources.PostCSS`.

## Design Tokens (`@theme`)

All design values are defined as CSS custom properties in the `@theme` block in `assets/css/main.css`. Tailwind v4 maps these to utility classes automatically — e.g. `--color-secondary` → `bg-secondary`, `text-secondary`, `border-secondary`.

**To change a design value, edit `main.css` only. Templates use token-based utilities throughout and will update automatically.**

### Colors

| Token | Value | Utility classes | Usage |
|---|---|---|---|
| `--color-surface` | `#212529` | `bg-surface`, `text-surface`, `border-surface` | Primary dark background, header, cards |
| `--color-secondary` | `#287d3d` | `bg-secondary`, `text-secondary`, `border-secondary` | Green accent, CTAs, borders |
| `--color-text` | `#333` | `bg-text`, `text-text` | Body text |
| `--color-muted` | `#666e76` | `text-muted` | Secondary/subdued text |
| `--color-ui-light` | `#f8f9fa` | `bg-ui-light` | Section backgrounds, card image headers |
| `--color-ui-subtle` | `#f0f0f0` | `bg-ui-subtle`, `border-ui-subtle` | Badge backgrounds, dividers |
| `--color-border` | `#e5e7eb` | `border-border` | Card borders |
| `--color-border-mid` | `#e0e0e0` | `border-border-mid` | List item borders, social icon borders |
| `--color-border-strong` | `#d0d0d0` | `border-border-strong` | Emphasized borders, filter button borders |
| `--color-image-bg` | `#333` | `bg-image-bg` | Image placeholder background before load |

### Typography

Custom font sizes beyond Tailwind's built-in scale. Always prefer these tokens over raw Tailwind size classes. Use `text-sm` for small UI text that doesn't warrant a named token (e.g. pagination labels, stat sublabels). Avoid `text-xs`, `text-lg`, `text-xl`, `text-2xl` — use the nearest token instead.

| Token | Value | Utility | Usage |
|---|---|---|---|
| `--text-badge` | `0.78rem` | `text-badge` | Tiny badge/label text, card metadata |
| `--text-fine` | `0.8rem` | `text-fine` | Fine print, footer section headings, filter button labels |
| `--text-caption` | `0.825rem` | `text-caption` | Captions, card "read more" links |
| `--text-body-sm` | `0.9rem` | `text-body-sm` | Compact body text, CTA button labels |
| `--text-body` | `0.95rem` | `text-body` | Default body text (detail views) |
| `--text-body-md` | `1.05rem` | `text-body-md` | Slightly enlarged body, section standfirsts |
| `--text-body-lg` | `1.2rem` | `text-body-lg` | Section intro copy, nav logo text |
| `--text-display-sm` | `1.75rem` | `text-display-sm` | Stat/counter numbers |
| `--text-display-lg` | `4rem` | `text-display-lg` | Large decorative display (404 page) |
| `--text-h1` | `clamp(2rem, 5vw, 3.25rem)` | `text-h1` | Hero/page hero heading |
| `--text-h2` | `clamp(1.75rem, 4vw, 2.5rem)` | `text-h2` | Page title banners, section headings |
| `--text-h3` | `clamp(1.5rem, 3vw, 2rem)` | `text-h3` | Sub-section headings, homepage section titles |

### Shadows

| Token | Value | Utility | Usage |
|---|---|---|---|
| `--shadow` | `0 2px 8px rgba(0,0,0,.1)` | `shadow` | Default card elevation |
| `--shadow-lg` | `0 .5rem 1.5rem rgba(0,0,0,.2)` | `shadow-lg` | Hover state elevation on cards |

### Spacing & Layout

| Token | Value | Utility | Usage |
|---|---|---|---|
| `--spacing-header` | `72px` | `h-header`, `top-header` | Sticky header height |
| `--width-container` | `1200px` | `max-w-container` | Max-width for all page content |
| `--breakpoint-md` | `1140px` | `md:` breakpoint | Main responsive breakpoint |
| `--radius` | `5px` | `rounded` (overrides default) | Standard border radius |

### Animations

`@keyframes marquee` is defined in `@theme` and used on the homepage business member logo strip:

```html
animate-[marquee_45s_linear_infinite]
```

## Buttons (`@utility`)

Every call-to-action button uses `.button` plus one colour variant:

| Classes | Look | Typical use |
|---|---|---|
| `button button-primary` | Green fill, inverts to white on hover | Main CTAs, shortcode buttons |
| `button button-dark` | Dark (`surface`) fill, inverts on hover | Secondary CTAs on light backgrounds |
| `button button-outline-light` | White outline on transparent | CTAs over dark/hero backgrounds |

Add layout utilities alongside as needed, e.g. `button button-primary inline-flex items-center gap-2 no-underline` for a button with an icon. Change the button design in `main.css`, not in templates.

These are defined with `@utility` rather than in `@layer components` on purpose. `.article-content` styles links through the typography plugin, which sits in the components layer. Defining buttons as utilities means a button shortcode used inside page content keeps its white text and weight instead of picking up the prose link styles.

## Custom Components (`@layer components`)

### `.nav-open`

Applied by `nav.js` to the mobile navigation `<ul>` when the hamburger is toggled. Overrides `hidden` with `flex!` (Tailwind v4's trailing-`!` important syntax) and positions the nav as a full-width drawer below the header.

### `.article-content`

Applied to the `<div>` wrapping `{{ .Content }}` on single pages and news/event detail views. Applies `@tailwindcss/typography` prose styles with surface-colour overrides for headings, links, and strong text. The plugin's other colours (body, bullets, counters, rules, blockquotes, inline code, captions, table borders) are set to `--color-text` through its `--tw-prose-*` variables. Change those variables to alter them, e.g. a lighter `--tw-prose-hr`.

**Alert callouts** (rendered from `> [!NOTE]`-style blockquotes in markdown, see [docs/editorial/markdown_shortcodes.md](../editorial/markdown_shortcodes.md)) are styled within `.article-content`:

| Class | Accent colour |
|---|---|
| `.md-alert` (default/note) | `#0969da` (blue) |
| `.md-alert-tip` | `#287d3d` (green, matches `--color-secondary`) |
| `.md-alert-important` | `#8250df` (purple) |
| `.md-alert-warning` | `#E0B507` (amber) |
| `.md-alert-caution` | `#A72326` (red) |

Alert background is generated with `color-mix(in srgb, <color> 10%, transparent)` so it automatically adapts to the accent colour.

### `.article-content .leaflet-container img`

Resets `@tailwindcss/typography`'s default image margins and `max-width: 100%` constraint for images inside a Leaflet map embedded within `.article-content` — Leaflet renders its map tiles as `<img>` tags, and without this override the `prose` styles push tiles out of alignment. See [docs/technical/remembrance_map.md](remembrance_map.md#tailwind-prose-fix) for the full explanation.
