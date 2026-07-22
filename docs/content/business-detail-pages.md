# Business member detail pages

> [!CAUTION]
> `content/business-member/` currently contains no pages. The one example page that used to live here (`timeless-ims.md`) was created and then deleted, and no business currently has a dedicated profile page. Everything below describes a working template with no live content — treat it as "how to add one," not "how the existing ones work." See [docs/known_gaps_future_work.md](../known_gaps_future_work.md).

Individual business member profile pages would live in `content/business-member/` and render with `layouts/business-member/single.html`. Hugo picks this template automatically because the section name (`business-member`, the top-level folder under `content/`) matches the layout directory name — no `layout:` front matter override is needed.

These are separate from the `data/businesses.yaml`-driven listing at `/business-directory` ([layouts/_default/business-directory.html](../../layouts/_default/business-directory.html)), which is the only business listing actually live on the site today. There's no automatic cross-linking between the two — a business needs an entry in `businesses.yaml` to appear in the directory grid, and/or a page in `content/business-member/` for a dedicated profile page; keeping both in sync (name, logo, contact details) would be a manual step.

## Co-located businesses in the directory

The directory (`data/businesses.yaml`) supports grouping multiple businesses that share one address under a single card, via a nested `businesses` list on an entry — e.g. "Viva Namaste" and "7th Heaven" share a card because they trade from the same premises. Sveltia CMS labels this "Co-located businesses" when editing an entry. See [docs/hugo/data_files.md](../hugo/data_files.md) for the field reference.

> [!NOTE]
> The directory's field name for Twitter/X is `x`, while the business-member template (below) uses `twitter`. If you're keeping a directory entry and a profile page in sync for the same business, don't assume the field names match.

## Front matter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Business name |
| `description` | No | Short tagline shown beneath the title |
| `header_image` | No | Path to hero banner image (see sizing below). Falls back to the standard dark surface title bar if omitted |
| `logo` | No | Path to the business logo |
| `address` | No | Street address displayed in the contact panel |
| `placeId` | No | Google Maps Place ID — adds a map pin icon link next to the address |
| `telephone` | No | Phone number — rendered as a `tel:` link |
| `email` | No | Email address — rendered as a `mailto:` link |
| `website` | No | Full URL — displayed without the `https://` prefix |
| `facebook` | No | Facebook profile URL |
| `instagram` | No | Instagram profile URL |
| `linkedin` | No | LinkedIn profile URL |
| `twitter` | No | Twitter/X profile URL |
| `youtube` | No | YouTube channel URL |
| `tiktok` | No | TikTok profile URL |
| `sections` | No | List of promo cards rendered in a two-column grid (see below) |

Everything after the front matter (the Markdown body) is optional intro prose, rendered as a centred `article-content` block between the contact panel and the promo sections.

## Page structure

The template renders, top to bottom:

1. **Hero** — `header_image` at `aspect-[16/5]` with a dark gradient overlay carrying the title and description, or a plain `bg-surface` title bar if no image is set.
2. **Contact panel** — logo (if set) beside a definition list of address (with an optional Google Maps pin link via `placeId`), phone, email, and website, plus a row of circular social icons for any of the supported platforms present in front matter.
3. **Intro prose** — the Markdown body, if any.
4. **Promo sections** — an optional two-column grid of image + copy cards driven by `sections`.
5. **Back link** — a static "← Back to Business Directory" link to `/business-directory`.

`{{ define "head_extra" }}` on this template injects Schema.org `WebPage` JSON-LD via `partials/jsonld/webpage.html`, same as the generic `_default/single.html` template.

## Hero image

The hero uses `aspect-[16/5]` (16:5). Recommended source image size: **1400 × 480px**. Hugo Pipes resizes and converts to WebP at build time. Centre the subject vertically — `object-cover` crops equally from top and bottom on narrow viewports.

## Promo sections

`sections` is a list of cards rendered two-per-row on medium+ screens. Each item supports:

| Field | Description |
|-------|-------------|
| `title` | Card heading |
| `content` | Body copy paragraph |
| `image` | Card image path — rendered at 16:9 |
| `link` | CTA button URL |
| `link_text` | CTA button label (defaults to `Learn More`) |

Example front matter:

```yaml
sections:
  - title: "Security"
    content: "Tailor-made solutions to protect your business."
    image: "/images/businesses/example/security.jpg"
    link: "https://example.com/security"
    link_text: "Discover More"
  - title: "People"
    content: "Supporting your most important asset."
    image: "/images/businesses/example/people.jpg"
    link: "https://example.com/people"
    link_text: "Read More"
```

## Social icons

Any social fields present in front matter are rendered as a row of circular icon buttons below the contact details, using the same hover style as the site footer. Supported: Facebook, Instagram, LinkedIn, Twitter, YouTube, TikTok. Icons live in `layouts/partials/icons/`.

## CMS

`business-member` is not currently a managed collection in `static/admin/config.yml` — editors create and edit these pages by hand (or via the `pages` collection only reaches top-level files directly in `content/`, which does not include `content/business-member/`, per [docs/sveltia_cms.md](../sveltia_cms.md)). Adding a dedicated Sveltia collection for this content type would need a new `folder` collection entry mirroring the `events`/`news` pattern.

## Adding a new business member page

1. Create `content/business-member/<slug>.md` with the relevant front matter fields above.
2. Add images to `static/images/businesses/<slug>/` (hero at 1400 × 788px, logo at any size — it renders `max-h-28` constrained).
3. Optionally add prose below the front matter — it renders as a centred article block between the contact panel and the promo sections.
