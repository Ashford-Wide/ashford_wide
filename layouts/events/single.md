# {{ .Title }}

- **Date:** {{ .Date.Format "Monday 2 January 2006" }}
{{- with .Params.startTime }}
- **Time:** {{ . }}{{ with $.Params.endTime }}–{{ . }}{{ end }}
{{- end }}
{{- with .Params.location }}
- **Location:** {{ . }}
{{- end }}
{{- with .Params.organiser }}
- **Organiser:** {{ . }}
{{- end }}
{{- if .Params.cancelled }}
- **Cancelled**
{{- end }}

{{ partial "markdown-body.md" . }}
