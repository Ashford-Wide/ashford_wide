{{- /*
  Renders the page's raw markdown source for the "markdown" output format,
  resolving/stripping shortcodes that RawContent leaves as literal
  {{< ... >}} syntax (RawContent never runs the shortcode pipeline).
*/ -}}
{{- $body := .RawContent -}}

{{- /* {{< param "x" >}} -> the resolved site param value */ -}}
{{- range findRE `\{\{<\s*param\s+"[^"]+"\s*>\}\}` $body -}}
  {{- $key := replaceRE `\{\{<\s*param\s+"([^"]+)"\s*>\}\}` "$1" . -}}
  {{- $val := index $.Site.Params $key | default "" -}}
  {{- $body = replace $body . $val -}}
{{- end -}}

{{- /* {{< image src="..." alt="..." >}} -> ![alt](src) */ -}}
{{- range findRE `\{\{<\s*image\s+[^>]*>\}\}` $body -}}
  {{- $src := "" -}}{{- if in . `src="` }}{{ $src = replaceRE `.*src="([^"]*)".*` "$1" . }}{{ end -}}
  {{- $alt := "" -}}{{- if in . `alt="` }}{{ $alt = replaceRE `.*alt="([^"]*)".*` "$1" . }}{{ end -}}
  {{- $body = replace $body . (printf "![%s](%s)" $alt $src) -}}
{{- end -}}

{{- /* {{< location-pin name="..." placeId="..." >}} -> a Google Maps link */ -}}
{{- range findRE `\{\{<\s*location-pin\s+[^>]*>\}\}` $body -}}
  {{- $name := "" -}}{{- if in . `name="` }}{{ $name = replaceRE `.*name="([^"]*)".*` "$1" . }}{{ end -}}
  {{- $placeId := "" -}}{{- if in . `placeId="` }}{{ $placeId = replaceRE `.*placeId="([^"]*)".*` "$1" . }}{{ end -}}
  {{- $url := printf "https://www.google.com/maps/search/?api=1&query=%s&query_place_id=%s" ($name | urlquery) ($placeId | urlquery) -}}
  {{- $body = replace $body . (printf "[View %s on Google Maps](%s)" $name $url) -}}
{{- end -}}

{{- /* {{< doc-button href="..." text="..." >}} -> a markdown link */ -}}
{{- range findRE `\{\{<\s*doc-button\s+[^>]*>\}\}` $body -}}
  {{- $href := "" -}}{{- if in . `href="` }}{{ $href = replaceRE `.*href="([^"]*)".*` "$1" . }}{{ end -}}
  {{- $text := "" -}}{{- if in . `text="` }}{{ $text = replaceRE `.*text="([^"]*)".*` "$1" . }}{{ end -}}
  {{- $body = replace $body . (printf "[%s](%s)" $text $href) -}}
{{- end -}}

{{- /* {{< last-updated >}} -> plain text using the page's Lastmod */ -}}
{{- range findRE `\{\{<\s*last-updated\s*>\}\}` $body -}}
  {{- $body = replace $body . (printf "_Last updated: %s_" ($.Lastmod.Format "January 2006")) -}}
{{- end -}}

{{- /* Anything else (carousel, maps, paypal-*, forms, membership-tiers, flag-grid, ...)
       has no meaningful markdown equivalent — drop the line entirely. */ -}}
{{- $body = replaceRE `(?m)^[ \t]*\{\{<[^\n]*>\}\}[ \t]*\n?` "" $body -}}
{{- $body = replaceRE `\{\{<[^}]*>\}\}` "" $body -}}

{{- $body | strings.TrimSpace -}}
