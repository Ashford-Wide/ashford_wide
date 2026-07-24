# CMS Collections & Content Editing

Sveltia CMS is served at `/admin/`. Edits are committed directly to the GitHub repo, triggering a Cloudflare Pages rebuild (~30 seconds).

This page covers what content editors can create and how the Markdown editor behaves. For authentication, hosting infrastructure, and local development, see [docs/technical/cms_infra.md](../technical/cms_infra.md).

## CMS Collections

Full reference: [Sveltia CMS collections](https://sveltiacms.app/en/docs/collections) · [Sveltia CMS fields](https://sveltiacms.app/en/docs/fields)

| Collection | Type | Manages |
|-----------|------|---------|
| `events` | folder | `content/events/{year}/*.md` — path template `{{year}}/{{slug}}` |
| `news` | folder | `content/news/{year}/*.md` — path template `{{year}}/{{slug}}` |
| `pages` | folder, `create: true`, `delete: false` | Every top-level `.md` file directly in `content/` (non-recursive, so `events/`, `news/`, `remembrance-day/`, `business-member/` are untouched) — editors can create new top-level pages here |
| `remembrance` | files | All 4 remembrance-day pages |
| `businesses` | files | `data/businesses.yaml` (including co-located businesses groupings) |
| `team` | files | `data/team.yaml` — name, role, and social links for each About page team member |

There is no `members` collection and no `data/members.yaml` file — the homepage member logo marquee is driven by `data/businesses.yaml` (see [docs/technical/hugo/data_files.md](../technical/hugo/data_files.md) and [docs/technical/hugo/template_architecture.md](../technical/hugo/template_architecture.md)).

Events and news use a `path: "{{year}}/{{slug}}"` template to preserve the year-subfolder structure in the repo (keeping Hugo's `permalinks` config working). Editors see a flat list in the CMS rather than a year tree — Sveltia's nested collection support is planned for v2.0 (mid-2026). `content/events/past.md` sits outside the year folder structure and is not managed by the CMS.

`omit_empty_optional_fields: true` is set globally so optional fields are not written to front matter when left blank.

The Remembrance Sunday road closures map is driven by a raw GeoJSON file rather than a CMS field — see "Updating the road data" in [docs/technical/remembrance_map.md](../technical/remembrance_map.md#updating-the-road-data) if the affected roads change.

### Stock photo search

`media_libraries.stock_assets.providers` in `config.yml` enables a Pexels stock photo search inside the CMS's media picker — when uploading an image, editors can search Pexels directly rather than needing to source a photo elsewhere first.

## Markdown Widget — Supported Formatting

| Element | Rich text editor | Raw Markdown mode |
|---|---|---|
| Headings, bold, italic, links, lists | Yes — toolbar buttons | Yes |
| Blockquote | Yes — toolbar button | Yes (`>` syntax) |
| Table | **No** — no visual table builder | Yes (GFM pipe syntax) |
| Code block | Yes — toolbar button | Yes |

Tables must be written in raw Markdown mode using standard GFM syntax.
