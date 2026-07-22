# Build

Full reference: [Hugo CLI](https://gohugo.io/commands/)

```bash
npm install        # Required before first build
hugo               # Development build
hugo --minify      # Production build (used by Cloudflare Pages)
hugo server        # Local dev server at http://localhost:1313
```

## Other npm scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run test:a11y` | `hugo && node scripts/a11y-test.mjs` | Builds the site, then runs WCAG 2.2 AA accessibility checks — see [docs/accessibility_testing.md](../accessibility_testing.md) |
| `npm run test:a11y:report` | `open accessibility-reports/` | Opens the accessibility report folder |
