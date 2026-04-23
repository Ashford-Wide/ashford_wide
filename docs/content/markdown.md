# Markdown authoring guide

## Alerts

Alerts (also called admonitions or callouts) are highlighted banners used to draw attention to important information. They are written as blockquotes with a special tag on the first line.

Five types are available:

| Tag | Use for |
|---|---|
| `[!NOTE]` | Supplementary information worth knowing |
| `[!TIP]` | Helpful suggestions or recommendations |
| `[!IMPORTANT]` | Information the reader must not miss |
| `[!WARNING]` | Potential issues or things to be careful about |
| `[!CAUTION]` | Serious risks or consequences |

### Syntax

```markdown
> [!NOTE]
> Your message here.
```

Each line of the alert must start with `> `. Multi-line alerts are supported:

```markdown
> [!WARNING]
> The car park at the venue is limited to 20 spaces.
> Please use the public car park on Station Road instead.
```

### Examples

```markdown
> [!NOTE]
> Entry is free and open to everyone.

> [!TIP]
> Arrive early to get the best choice of outside stalls.

> [!IMPORTANT]
> You must register in advance — walk-ins cannot be accommodated.

> [!WARNING]
> This is an outdoor event. It will go ahead in light rain, but check the
> Facebook page on the morning for any last-minute cancellations.

> [!CAUTION]
> The venue is not wheelchair accessible via the main entrance. Please use
> the side gate on Park Lane.
```
