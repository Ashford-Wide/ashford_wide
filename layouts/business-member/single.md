# {{ .Title }}
{{ with .Description }}
{{ . }}
{{ end }}
{{- with .Params.address }}
- **Address:** {{ . }}
{{- end }}
{{- with .Params.telephone }}
- **Phone:** {{ . }}
{{- end }}
{{- with .Params.email }}
- **Email:** {{ . }}
{{- end }}
{{- with .Params.website }}
- **Website:** {{ . }}
{{- end }}

{{ partial "markdown-body.md" . }}
