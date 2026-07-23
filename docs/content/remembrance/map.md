# Road Closures Map

The Remembrance Sunday road closures page at `/remembrance-day/road-closures/` embeds an interactive map using [Leaflet](https://leafletjs.com/) with [OpenStreetMap](https://www.openstreetmap.org/) tiles, showing the affected roads from a GeoJSON file.

## Files involved

| File | Purpose |
|---|---|
| `static/geojson/closures.geojson` | Road geometry data |
| `layouts/shortcodes/road-closure-map.html` | Leaflet map shortcode |
| `content/remembrance-day/road-closures.md` | Page that embeds the shortcode |
| `assets/css/main.css` | Contains the Tailwind prose fix (see below) |

## GeoJSON data (`static/geojson/closures.geojson`)

The road geometries are stored as a GeoJSON `FeatureCollection` with one `LineString` feature per road. Each feature's `properties.name` is the road name (e.g. `"Church Road"`), sourced directly from OpenStreetMap via [Overpass Turbo](https://overpass-turbo.eu/). The `closures.geojson` data can be edited with [geojson.io](https://geojson.io/next/).

**Why `static/` and not `data/`?**

Hugo's `data/` directory only supports YAML, TOML, JSON, and CSV. Files with a `.geojson` extension are not recognised — placing one there causes Hugo to fail loading the entire data directory, breaking unrelated pages (e.g. the business directory). Placing the file in `static/geojson/` means Hugo serves it as a plain file at `/geojson/closures.geojson`, which the shortcode fetches at runtime. The site has a few other GeoJSON files served the same way — `static/geojson/aed.geojson` (defibrillator locations) and `static/geojson/poppies-2025.geojson` (virtual poppy wall pins) — see [docs/hugo/template_architecture.md](../hugo/template_architecture.md#shortcodes).

### Updating the road data

The road geometries should be re-exported from OSM if the affected roads change. The recommended workflow:

1. Go to [Overpass Turbo](https://overpass-turbo.eu/) and run a query to select the relevant OSM ways by ID, e.g.:

   ```
   [out:json];
   way(id:153924574, 153924581, 228940762, 819556464);
   out geom;
   ```

2. Click **Export → GeoJSON** and save the output.
3. Trim the exported file to only the coordinate range that represents the closed section of each road (Overpass exports the full way, which may extend beyond the closure).
4. Replace `static/geojson/closures.geojson` with the new file.

Because the data comes from the same OSM dataset as the map tiles, the lines will align exactly with the underlying roads.

## Shortcode (`layouts/shortcodes/road-closure-map.html`)

The shortcode is self-contained. It loads Leaflet from the [unpkg](https://unpkg.com/) CDN, renders a map `<div>`, then fetches `/geojson/closures.geojson` and adds the features as styled polylines.

Key implementation details:

- **`fitBounds`** — the map viewport is set automatically from the GeoJSON layer bounds rather than a hardcoded centre and zoom, so the view always fits the data regardless of what roads are in the file.
- **Popups** — clicking a line shows a popup reading "**Road Closed**" followed by `feature.properties.name` (the OSM road name).
- **Style** — dashed red lines (`color: #A72326`, `weight: 7`, `opacity: 0.85`, `dashArray: '10, 10'`) to indicate a closure. `#A72326` is the same red used for the `[!CAUTION]` alert accent colour (see [docs/tailwind.md](../../tailwind.md)).

The shortcode is embedded in the page with:

```
{{< road-closure-map >}}
```

## CSP compatibility

No changes to `static/_headers` were needed. The existing policy already covers all Leaflet requirements:

| Requirement | Directive | Covered by |
|---|---|---|
| Leaflet JS from unpkg.com | `script-src` | `https://unpkg.com` |
| Leaflet CSS from unpkg.com | `style-src` | `https://unpkg.com` |
| OSM tile images | `img-src` | `https:` (all HTTPS origins) |
| `fetch('/geojson/closures.geojson')` | `connect-src` | `'self'` |

## Tailwind `prose` fix

The page content is wrapped in `.article-content`, which applies Tailwind's `prose` typography plugin. `prose` adds `margin-top: 2em; margin-bottom: 2em` to all `img` elements. Leaflet renders map tiles as `<img>` tags, so without a fix each tile is shifted down by its top margin, causing the tile layer to be visually offset from the vector overlays.

The fix in `assets/css/main.css` resets margins and the prose `max-width: 100%` constraint for images inside the Leaflet container:

```css
.article-content .leaflet-container img {
  @apply m-0 max-w-none;
}
```

This must be kept if `.article-content` ever wraps a Leaflet map elsewhere on the site.
