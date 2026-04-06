# Hugo Configuration

## `hugo.toml`

Full reference: [Hugo site configuration](https://gohugo.io/configuration/all/)

```toml
baseURL = "https://ashford-wide.pages.dev"
languageCode = "en-gb"
title = "Ashford Wide"
publishDir = "public"
paginate = 9             # News list pages — 9 per page (fits 3-column grid evenly)
buildDrafts = false
buildFuture = true       # Required — events are often future-dated
enableRobotsTXT = true
disableHugoGeneratorInject = true

[params]
  legalName = "Ashford Wide"                 # Legal registered name — used in org JSON-LD
  description = "Working together for a better Ashford"
  tagline = "Working together for a better Ashford"
  showRemembrance = false                    # Set true to show Remembrance link in nav
  email = "community@ashfordwide.com"        # General contact email
  businessEmail = "business@ashfordwide.com" # Business-specific contact email
  ogImage = "/images/og-default.jpg"         # Default Open Graph image (1200×630px)
  companyNumber = ""                         # Companies House number — omitted from JSON-LD if blank
  facebook = "https://www.facebook.com/AshfordWide"
  twitter = "https://twitter.com/AshfordWide"
  instagram = "https://www.instagram.com/ashfordwide"

[markup.goldmark.renderer]
  unsafe = true   # Allows raw HTML inside Markdown (used in contact form, support page)

[taxonomies]
  tag = "tags"

[permalinks]
  [permalinks.page]
    news = "/news/:contentbasename/"
    events = "/events/:contentbasename/"
```

[`buildFuture = true`](https://gohugo.io/configuration/build/) is essential — without it Hugo will not render pages for future-dated events.

The [`permalinks`](https://gohugo.io/configuration/permalinks/) rules use `:contentbasename` (filename only, no directory) so that news and events can be organised into year subdirectories without the year appearing in the URL. For example, `content/events/2026/summer-market-2026.md` resolves to `/events/summer-market-2026/`.