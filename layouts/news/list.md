# News

The latest from Ashford Wide
{{ range (where .Site.RegularPages "Section" "news").ByDate.Reverse }}
{{- $mdURL := "" -}}
{{- with .OutputFormats.Get "markdown" }}{{ $mdURL = .Permalink }}{{ end -}}
- [{{ .Title }}]({{ $mdURL }}) ({{ .Date.Format "2 January 2006" }}){{ with .Params.description }} — {{ . }}{{ end }}
{{ end }}
