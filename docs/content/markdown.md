# Markdown authoring guide

This page covers formatting that goes beyond standard Markdown (headings, bold/italic, links, lists) — alerts, the shortcodes editors are most likely to use, and the front matter fields each content type expects. Standard Markdown works as usual and isn't documented here.

## Shortcodes

Shortcodes are special tags that insert dynamic content into an otherwise-plain Markdown page. The most commonly used ones in existing content:

| Shortcode | Use |
|---|---|
| `{{</* param "email" */>}}` | Outputs a site-wide value from `hugo.toml` (e.g. an email address) — keeps content in sync with config instead of hardcoding. See [docs/hugo/configuration.md](../hugo/configuration.md) for available param names. |
| `{{</* image src="/images/foo.jpg" alt="..." */>}}` | Inserts an image, processed through the site's image pipeline. See [docs/hugo/images.md](../hugo/images.md). |
| `{{</* location-pin placeId="..." */>}}` | Small map-pin icon linking to a Google Maps place |
| `{{</* pin-map */>}}` | Embeds a Leaflet pin/marker map |
| `{{</* road-closure-map */>}}` | Embeds the Remembrance Sunday road closures map — see [docs/content/remembrance/map.md](remembrance/map.md) |
| `{{</* team */>}}` | Renders the team list from `data/team.yaml` (used on the About page) |
| `{{</* carousel */>}}` | Image carousel/slider |
| `{{</* flag-grid */>}}` | Grid of sponsored St George's flags |
| `{{</* doc-button */>}}` | Button linking to a downloadable document |
| `{{</* last-updated */>}}` | Outputs the page's last-modified date |
| `{{</* membership-tiers */>}}` | Membership tier comparison cards |
| `{{</* paypal-donate */>}}`, `paypal-banner`, `paypal-flags`, `paypal-poppy`, `paypal-rememberance`, `paypal-business-annual`, `paypal-business-monthly` | PayPal payment buttons for different purposes — see [docs/hugo/template_architecture.md](../hugo/template_architecture.md) for the full list |
| `{{</* join-us-button */>}}` / `{{</* support-us-button */>}}` | Standard call-to-action buttons |

Full shortcode reference (every file, what it renders, where it's implemented): [docs/hugo/template_architecture.md](../hugo/template_architecture.md#shortcodes).

## Common front matter fields

Every content type has its own required/optional front matter fields, set in Sveltia CMS or directly in the Markdown file's `---` block.

**Events** (`content/events/<year>/*.md`): `title`, `date`, `startTime`, `endTime`, `location`, `placeId`, `address`, `organiser`, `organiserUrl`, `description`, `image`, `imageAspect`, `endDate`, `eventStatus`, `attendanceMode`. Full reference: [docs/hugo/content_architecture.md](../hugo/content_architecture.md#event-front-matter).

**News** (`content/news/<year>/*.md`): `title`, `date`, `author`, `description`, `image`. Full reference: [docs/hugo/content_architecture.md](../hugo/content_architecture.md#news-front-matter).

**Standard pages** (everything else directly in `content/`): `title`, `description`, optional `layout` override. Full reference: [docs/hugo/content_architecture.md](../hugo/content_architecture.md#standard-page-front-matter).

## Alerts

Alerts (also called callouts) are highlighted banners used to draw attention to important information. They are written as blockquotes with a special tag on the first line.

Five types are available:

| Tag | Use for |
|---|---|
| `[!NOTE]` | Supplementary information worth knowing |
| `[!TIP]` | Helpful suggestions or recommendations |
| `[!IMPORTANT]` | Information the reader must not miss |
| `[!WARNING]` | Potential issues or things to be careful about |
| `[!CAUTION]` | Serious risks or consequences |

### Syntax

```markdown
> [!NOTE]
> Your message here.
```

Each line of the alert must start with `> `. Multi-line alerts are supported:

```markdown
> [!WARNING]
> The car park at the venue is limited to 20 spaces.
> Please use the public car park on Station Road instead.
```

### Examples

> [!NOTE]
> Entry is free and open to everyone.

```markdown
> [!NOTE]
> Entry is free and open to everyone.
```

> [!TIP]
> Arrive early to get the best choice of outside stalls.

```markdown
> [!TIP]
> Arrive early to get the best choice of outside stalls.
```

> [!IMPORTANT]
> You must register in advance — walk-ins cannot be accommodated.

```markdown
> [!IMPORTANT]
> You must register in advance — walk-ins cannot be accommodated.
```

> [!WARNING]
> This is an outdoor event. It will go ahead in light rain, but check the Facebook page on the morning for any last-minute cancellations.

```markdown
> [!WARNING]
> This is an outdoor event. It will go ahead in light rain, but check the Facebook page on the morning for any last-minute cancellations.
```

> [!CAUTION]
> The venue is not wheelchair accessible via the main entrance. Please use the side gate on Clockhouse Lane.

```markdown
> [!CAUTION]
> The venue is not wheelchair accessible via the main entrance. Please use the side gate on Clockhouse Lane.
```
