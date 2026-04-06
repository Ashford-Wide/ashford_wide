# CSS & Styling (Tailwind CSS v4)

Full reference: [Tailwind CSS docs](https://tailwindcss.com/docs/)

## Setup & Workflow

- **Dependencies**: [Tailwind CSS](https://tailwindcss.com/docs/) is built via [PostCSS](https://postcss.org/) and `postcss-cli` using [Hugo Pipes](https://gohugo.io/hugo-pipes/). [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin) is also installed for markdown prose styling. An `npm install` is required after cloning the repo.
- **Entry Point**: `assets/css/main.css` processes Tailwind directives (`@import "tailwindcss";`, `@theme`, `@layer components`, etc.).
- **Hugo Integration**: Included in `layouts/partials/head.html` using Hugo's internal asset processing (`resources.PostCSS`). See [Hugo Pipes — PostCSS](https://gohugo.io/hugo-pipes/postcss/).

## Design Tokens ([`@theme`](https://tailwindcss.com/docs/theme) variables)

- **Colors**: `--color-surface` (`#212529`), `--color-text` (`#333`), `--color-muted` (`#6c757d`).
- **Animations**: The homepage marquee animation is defined using `@keyframes marquee`.

## Custom Components
Defined in `assets/css/main.css` within [`@layer components`](https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes):
- `.article-content` — Applies `prose` from [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin) to markdown output on single pages.
- `.nav-open` — Used by the mobile navigation JavaScript to disable scrolling.
