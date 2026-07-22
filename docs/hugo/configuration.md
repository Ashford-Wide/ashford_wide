# Hugo Configuration

## `hugo.toml`

Full reference: [Hugo site configuration](https://gohugo.io/configuration/all/)

```toml
baseURL = "https://www.ashfordwide.com"
locale = "en-GB"
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
  showRemembrance = false                    # Set true to show Remembrance link in nav
  logo = "/images/aw-logo.png"              # Logo image path
  email = "community@ashfordwide.com"        # General contact email
  businessEmail = "business@ashfordwide.com" # Business-specific contact email
  safeguardingEmail = "safeguarding@ashfordwide.com"  # Used in content/contact.md via the param shortcode
  financeEmail = "finance@ashfordwide.com"   # Used in content/contact.md via the param shortcode
  ogImage = "/images/home-primary-image.jpg" # Default Open Graph image (1200×630px)
  foundingDate = 2012                        # Used in org JSON-LD
  companyNumber = ""                         # Companies House number — omitted from JSON-LD if blank
  activePromo = ""                           # Slug of the active promotion page, or blank if none
  facebookDomainVerification = "FACEBOOK_CODE"  # Facebook domain verification meta tag
  bingDomainVerification = "98F441D5DBDE4586ADBED0D83AEF5AAA"  # Bing Webmaster Tools verification meta tag
  facebook = "https://www.facebook.com/AshfordWide"
  twitter = "https://x.com/AshfordWide"
  instagram = "https://www.instagram.com/ashfordwide"
  linkedin = ""                              # LinkedIn page URL, or blank if not set
  googleBusinessProfile = ""                 # Google Business Profile URL — added to org JSON-LD `sameAs` if set

[security]
  [security.node]
    [security.node.permissions]
      allowAddons        = ["tailwindcss", "postcss"]  # lightningcss is a native addon used by @tailwindcss/postcss
      allowWorker        = ["tailwindcss", "postcss"]  # Tailwind uses worker threads during CSS processing
      allowChildProcess  = ["tailwindcss", "postcss"]  # detect-libc spawns getconf on some Linux setups

[markup.goldmark.renderer]
  unsafe = true   # Allows raw HTML inside Markdown

[taxonomies]
  tag = "tags"

[privacy]
  [privacy.instagram]
    disable = false
    simple = true   # Use Hugo's simple Instagram shortcode (no JS embed) — see docs/hugo/template_architecture.md
  [privacy.youTube]
    disable = true            # Hugo's built-in YouTube shortcode is not used on this site
    privacyEnhanced = true
  [privacy.vimeo]
    disable = false
    enableDNT = true
    simple = false

[permalinks]
  [permalinks.page]
    news = "/news/:contentbasename/"
    events = "/events/:contentbasename/"
```

[`buildFuture = true`](https://gohugo.io/configuration/build/) is essential — without it Hugo will not render pages for future-dated events.

The `[security.node.permissions]` block is required because this project processes CSS via Hugo's `postCSS` pipe with `@tailwindcss/postcss`. Hugo's Node permission model defaults only cover a process named `tailwindcss` (used by the native `css.TailwindCSS` pipe); since this project invokes PostCSS as a separate process, `postcss` must be added explicitly. All three permissions are needed: `lightningcss` is a native addon, Tailwind uses worker threads, and `detect-libc` (a Tailwind dependency) spawns `getconf` as a child process on some Linux environments. The `tailwindcss` entries preserve the defaults so they are not silently dropped.

The [`permalinks`](https://gohugo.io/configuration/permalinks/) rules use `:contentbasename` (filename only, no directory) so that news and events can be organised into year subdirectories without the year appearing in the URL. For example, `content/events/2026/summer-market-2026.md` resolves to `/events/summer-market-2026/`.

## External link handling

Every external link on the site gets `target="_blank" rel="noopener noreferrer"` — this isn't a Hugo/goldmark default, it's handled by two mechanisms depending on where the link comes from.

**Template-rendered links** (team socials, business directory, business member pages, event location/organiser links, footer socials) go through a shared partial, `layouts/partials/external-link.html`. It's called with a `dict` of parameters:

| param | purpose |
|---|---|
| `href` | link destination (required) |
| `class` | full class string, passed through verbatim |
| `ariaLabel` | optional `aria-label` |
| `icon` | optional icon partial path, e.g. `"icons/facebook.html"` |
| `iconWrapClass` | optional wrapper `<span>` class for the icon |
| `text` | optional visible link text |
| `itemprop` | optional, e.g. `"sameAs"` for schema.org markup on `team.html` |
| `context` | `.` to forward into the icon partial call |

Example call (from `layouts/partials/footer.html`):

```go-html-template
{{ partial "external-link.html" (dict "href" . "class" $socialBtnClass "ariaLabel" "Facebook" "icon" "icons/facebook.html" "context" $) }}
```

Centralizing this means the `rel`/`target` attributes can't drift out of sync between templates — previously the footer's social links were missing `noreferrer` while every other template had it.

**Markdown body links** (e.g. a link an editor pastes into a news post or event description in Sveltia CMS) are handled by a [render hook](https://gohugo.io/render-hooks/links/) at `layouts/_default/_markup/render-link.html`. Hugo invokes this automatically for every `[text](url)` link during Markdown rendering, so it applies to all content — existing and future — with no CMS field or editor workflow changes. It only adds `target="_blank" rel="noopener noreferrer"` when the link's host differs from the site's own (`site.BaseURL`, i.e. `www.ashfordwide.com`) — internal links, `#anchors`, `mailto:`, and `tel:` links are left untouched.
