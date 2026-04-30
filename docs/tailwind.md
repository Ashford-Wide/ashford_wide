# CSS & Styling (Tailwind CSS v4)

Full reference: [Tailwind CSS docs](https://tailwindcss.com/docs/)

## Setup & Workflow

- **Dependencies**: Tailwind CSS is built via PostCSS and `postcss-cli` using Hugo Pipes. `@tailwindcss/typography` is also installed for markdown prose styling. An `npm install` is required after cloning the repo.
- **Entry point**: `assets/css/main.css` — contains all `@theme` tokens, `@keyframes`, and `@layer components` classes.
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
| `--text-subtitle` | `1.15rem` | `text-subtitle` | Footer brand name |
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

### Transitions

| Token | Value | Utility | Usage |
|---|---|---|---|
| `--translate-lift` | `3px` | `-translate-y-lift` | Card hover lift — defined but not currently applied |
| `--translate-lift-sm` | `2px` | `-translate-y-lift-sm` | Card hover lift — defined but not currently applied |

### Animations

`@keyframes marquee` is defined in `@theme` and used on the homepage business member logo strip:

```html
animate-[marquee_45s_linear_infinite]
```

## Custom Components (`@layer components`)

### `.nav-open`

Applied by `nav.js` to the mobile navigation `<ul>` when the hamburger is toggled. Overrides `hidden` with `!flex` and positions the nav as a full-width drawer below the header.

### `.article-content`

Applied to the `<div>` wrapping `{{ .Content }}` on single pages and news/event detail views. Applies `@tailwindcss/typography` prose styles with surface-colour overrides for headings, links, and strong text.

**Alert callouts** (rendered from `> [!NOTE]`-style blockquotes in markdown) are styled within `.article-content`:

| Class | Accent colour |
|---|---|
| `.alert` (default/note) | `#0969da` (blue) |
| `.alert-tip` | `#287d3d` (green, matches `--color-secondary`) |
| `.alert-important` | `#8250df` (purple) |
| `.alert-warning` | `#E0B507` (amber) |
| `.alert-caution` | `#A72326` (red) |

Alert background is generated with `color-mix(in srgb, <color> 10%, transparent)` so it automatically adapts to the accent colour.
