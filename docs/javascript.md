# JavaScript

There is no JavaScript framework. Two small scripts served from `assets/js/` via [Hugo Pipes](https://gohugo.io/hugo-pipes/) (minified and fingerprinted in production):

## `assets/js/nav.js`

Loaded on every page via `layouts/partials/footer.html`.

Wires up the hamburger button (`#nav-toggle`) to toggle the `nav-open` class on `#main-nav` and update `aria-expanded`.

## `assets/js/business-directory.js`

Loaded only on the business directory page via `layouts/_default/business-directory.html`:

Handles category filter button clicks — toggles active styles on `.biz-filter` buttons and shows/hides `.biz-card` elements by matching `data-category`.

## Pipes

Both scripts are included using [Hugo Pipes](https://gohugo.io/hugo-pipes/):
```go
{{ $js := resources.Get "js/nav.js" }}
{{ if hugo.IsProduction }}
  {{ $js = $js | minify | fingerprint }}
{{ end }}
<script src="{{ $js.Permalink }}"{{ if hugo.IsProduction }} integrity="{{ $js.Data.Integrity }}"{{ end }}></script>
```
