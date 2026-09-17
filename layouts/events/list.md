# Events

See what's on in Ashford
{{- $cutoff := now.AddDate 0 0 -1 }}
{{- $events := where .Site.RegularPages "Section" "events" }}
{{- $upcoming := (where $events ".Date" "gt" $cutoff).ByDate }}
{{- $past := (where $events ".Date" "le" $cutoff).ByDate.Reverse }}

{{ if $upcoming }}
## Upcoming Events
{{ range $upcoming }}
{{- $mdURL := "" -}}
{{- with .OutputFormats.Get "markdown" }}{{ $mdURL = .Permalink }}{{ end -}}
- [{{ .Title }}]({{ $mdURL }}) — {{ .Date.Format "Monday 2 January 2006" }}{{ with .Params.location }}, {{ . }}{{ end }}
{{ end }}
{{ end }}
{{ if $past }}
## Past Events
{{ range $past }}
{{- $mdURL := "" -}}
{{- with .OutputFormats.Get "markdown" }}{{ $mdURL = .Permalink }}{{ end -}}
- [{{ .Title }}]({{ $mdURL }}) — {{ .Date.Format "Monday 2 January 2006" }}
{{ end }}
{{ end }}
