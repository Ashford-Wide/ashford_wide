# {{ .Title }}
{{ with .Description }}
{{ . }}
{{ end }}
{{ with .Content }}
{{ partial "markdown-body.md" $ }}
{{ end }}
{{ range .Pages }}
{{- $mdURL := "" -}}
{{- with .OutputFormats.Get "markdown" }}{{ $mdURL = .Permalink }}{{ end -}}
- [{{ .Title }}]({{ $mdURL }}){{ with .Description }} — {{ . }}{{ end }}
{{ end }}
