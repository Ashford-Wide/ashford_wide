# Hugo Configuration

## `hugo.toml`

Full reference: [Hugo site configuration](https://gohugo.io/configuration/all/)

```toml
baseURL = "https://ashford-wide.pages.dev"
languageCode = "en-GB"
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
  logo = "/images/aw-logo.png"              # Logo image path
  email = "community@ashfordwide.com"        # General contact email
  businessEmail = "business@ashfordwide.com" # Business-specific contact email
  ogImage = "/images/og-default.jpg"         # Default Open Graph image (1200×630px)
  foundedYear = 2012                         # Used in org JSON-LD
  companyNumber = ""                         # Companies House number — omitted from JSON-LD if blank
  activePromo = ""                           # Slug of the active promotion page, or blank if none
  googleSiteVerification = ""               # Google Search Console verification meta tag
  facebookDomainVerification = ""           # Facebook domain verification meta tag
  facebook = "https://www.facebook.com/AshfordWide"
  twitter = "https://twitter.com/AshfordWide"
  instagram = "https://www.instagram.com/ashfordwide"
  linkedin = ""                              # LinkedIn page URL, or blank if not set

[security]
  [security.node]
    [security.node.permissions]
      allowAddons        = ["tailwindcss", "postcss"]  # lightningcss is a native addon used by @tailwindcss/postcss
      allowWorker        = ["tailwindcss", "postcss"]  # Tailwind uses worker threads during CSS processing
      allowChildProcess  = ["tailwindcss", "postcss"]  # detect-libc spawns getconf on some Linux setups

[markup.goldmark.renderer]
  unsafe = true   # Allows raw HTML inside Markdown (used in contact form, support page)

[taxonomies]
  tag = "tags"

[privacy]
  [privacy.instagram]
    simple = true   # Use Hugo's simple Instagram shortcode (no JS embed)

[permalinks]
  [permalinks.page]
    news = "/news/:contentbasename/"
    events = "/events/:contentbasename/"
```

[`buildFuture = true`](https://gohugo.io/configuration/build/) is essential — without it Hugo will not render pages for future-dated events.

The `[security.node.permissions]` block is required because this project processes CSS via Hugo's `postCSS` pipe with `@tailwindcss/postcss`. Hugo's Node permission model defaults only cover a process named `tailwindcss` (used by the native `css.TailwindCSS` pipe); since this project invokes PostCSS as a separate process, `postcss` must be added explicitly. All three permissions are needed: `lightningcss` is a native addon, Tailwind uses worker threads, and `detect-libc` (a Tailwind dependency) spawns `getconf` as a child process on some Linux environments. The `tailwindcss` entries preserve the defaults so they are not silently dropped.

The [`permalinks`](https://gohugo.io/configuration/permalinks/) rules use `:contentbasename` (filename only, no directory) so that news and events can be organised into year subdirectories without the year appearing in the URL. For example, `content/events/2026/summer-market-2026.md` resolves to `/events/summer-market-2026/`.
