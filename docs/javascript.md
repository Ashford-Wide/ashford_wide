# JavaScript

There is no JavaScript framework. Three small scripts served from `assets/js/` via [Hugo Pipes](https://gohugo.io/hugo-pipes/) (minified and fingerprinted in production):

## `assets/js/nav.js`

Loaded on every page via `layouts/partials/footer.html`.

Wires up the hamburger button (`#nav-toggle`) to toggle the `nav-open` class on `#main-nav` and update `aria-expanded`.

## `assets/js/business-directory.js`

Loaded only on the business directory page via `layouts/_default/business-directory.html`:

Handles category filter button clicks — toggles active styles on `.biz-filter` buttons and shows/hides `.biz-card` elements by matching `data-category`. Also shows/hides a `#biz-empty` "no results" message depending on how many cards are visible.

## `assets/js/vimeo-facade.js`

Loaded via `layouts/partials/featured-video.html`, wherever that partial is used to embed a Vimeo video.

Implements a click-to-load "facade" for embedded videos, to avoid loading Vimeo's player iframe (and its scripts) until the visitor actually wants to watch. It finds `#vimeo-facade` and, on click or on `Enter`/`Space` keypress, replaces itself with a live `<iframe>` pointing at `https://player.vimeo.com/video/{videoId}`, using the video ID and accessible label set on the facade element by the partial.

## Pipes

All three scripts are included using [Hugo Pipes](https://gohugo.io/hugo-pipes/), following the same pattern:
```go
{{ $js := resources.Get "js/nav.js" }}
{{ if hugo.IsProduction }}
  {{ $js = $js | minify | fingerprint }}
{{ end }}
<script src="{{ $js.Permalink }}"{{ if hugo.IsProduction }} integrity="{{ $js.Data.Integrity }}"{{ end }}></script>
```
