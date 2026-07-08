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
| `mobile` | string | no |
| `email` | string | no |
| `address` | string | no |
| `facebook` | string (URL) | no |
| `instagram` | string (URL) | no |
| `x` | string (URL) | no |
| `logo` | string (path) | no |

## `data/members.yaml`

Editable via the Sveltia CMS ("Member Logos" collection), but not currently read by any template. The homepage member logo marquee actually reads from `data/businesses.yaml` (see above), filtered to entries with a `logo` set. Fields: `name`, `logo` (image path).

## `data/team.yaml`

Placeholder team data. Fields: `name`, `role`. Not currently rendered in any template.
