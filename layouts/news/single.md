# {{ .Title }}

{{ .Date.Format "2 January 2006" }}{{ with .Params.author }} · {{ . }}{{ end }}

{{ partial "markdown-body.md" . }}
