# Accessibility Testing

Automated accessibility scanning is provided by [`accessibility-checker`](https://www.npmjs.com/package/accessibility-checker) (IBM Equal Access Checker), installed as a dev dependency.

## npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run test:a11y` | `hugo && node scripts/a11y-test.js` | Builds the site then scans all HTML output files |
| `npm run test:a11y:report` | `open accessibility-reports/` | Opens the report folder in Finder after a scan |

## Scan Script (`scripts/a11y-test.js`)

Scanning is handled via a Node.js script using achecker's programmatic API rather than the CLI. This is necessary because the CLI only processes one file per invocation. The script:

- Finds all HTML files under `public/` using `find`
- Excludes pages that shouldn't be tested: `/admin/` (Sveltia CMS), `/data/`, and Hugo pagination paths (`/news/page/`, `/events/page/`)
- Scans each page using `aChecker.getCompliance()` with a `file://` URL
- Wraps each scan in try/catch so a Puppeteer navigation error on one page doesn't abort the run
- Exits non-zero if any page has violations or errors

## Configuration (`.achecker.yml`)

```yaml
ruleArchive: latest
policies:
  - WCAG_2_2          # WCAG 2.2 (AA level implicit) — https://www.w3.org/TR/WCAG22/
failLevels:
  - violation         # Exit non-zero only on confirmed violations
reportLevels:
  - violation
  - potentialviolation
outputFormat:
  - json
  - html
outputFolder: accessibility-reports
```

## Reports

After running `npm run test:a11y`, two types of output are written to `accessibility-reports/`:

- **Per-page reports** — one `.json` and one `.html` file per scanned page, nested under the full file path (e.g. `accessibility-reports/Users/.../public/contact/index.html.json`)
- **Summary** — `summary_<timestamp>.json` at the root of the folder, containing aggregate counts across all pages

`npm run test:a11y:report` opens the folder in Finder. The folder is excluded from git via `.gitignore`.
