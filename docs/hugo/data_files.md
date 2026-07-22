# Data Files

Full reference: [Hugo data templates](https://gohugo.io/functions/hugo/data/)

## `data/businesses.yaml`

Drives the `/business-directory/` page. Fields:

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes |
| `category` | string | yes — used for filter pills |
| `description` | string | yes |
| `website` | string | no |
| `telephone` | string | no |
| `mobile` | string | no — rendered as a second phone line labelled "(mobile)" |
| `email` | string | no |
| `address` | string | no |
| `placeId` | string | no — Google Maps Place ID |
| `facebook` | string (URL) | no |
| `instagram` | string (URL) | no |
| `linkedin` | string (URL) | no |
| `x` | string (URL) | no — Twitter/X profile |
| `youtube` | string (URL) | no |
| `tiktok` | string (URL) | no |
| `logo` | string (path) | no |
| `businesses` | list | no — see "Co-located businesses" below |

### Co-located businesses

An entry can group several businesses that share one address/category under a single directory card, using a nested `businesses` list. Each nested item supports the same fields as above (minus `category`, `address`, and `placeId`, which are inherited from the parent) — for example, "Viva Namaste" and "7th Heaven" share one card because they operate from the same premises. This is what the Sveltia CMS labels "Co-located businesses" when editing an entry.

## `data/team.yaml`

Drives the team list on the About page via the `{{< team >}}` shortcode (`layouts/shortcodes/team.html`, used in `content/about.md`). Fields:

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes |
| `role` | string | yes |
| `linkedin` | string (URL) | no |
| `instagram` | string (URL) | no |
| `facebook` | string (URL) | no |
| `twitter` | string (URL) | no |

Each person is rendered with Schema.org `Person` microdata — see [docs/seo.md](../seo.md#team-microdata).

## `data/poppies/2025.yaml`

Names, dedications, and sponsor names for the Remembrance Day virtual poppy wall. Read by `layouts/shortcodes/pin-map.html` and `layouts/remembrance-day/virtual-poppy-wall.html`. Fields: `name`, `dedication`, `from`.
