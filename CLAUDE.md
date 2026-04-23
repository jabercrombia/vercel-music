@AGENTS.md

## Docs

Documentation is served at `/docs/` using Next.js MDX (App Router). Source files:

- [app/docs/layout.tsx](app/docs/layout.tsx) — docs shell: `<html>`, `<body>`, header, sidebar nav, Roboto font
- [app/docs/docs.css](app/docs/docs.css) — all docs styles (layout, nav, typography, code, tables)
- [app/docs/page.mdx](app/docs/page.mdx) — landing page at `/docs`
- [app/docs/overview/page.mdx](app/docs/overview/page.mdx) — problem, solution, key decisions
- [app/docs/architecture/page.mdx](app/docs/architecture/page.mdx) — tech stack, system diagram (Mermaid), i18n, caching
- [app/docs/api/page.mdx](app/docs/api/page.mdx) — Last.fm endpoints, types, env variables
- [app/docs/seo/page.mdx](app/docs/seo/page.mdx) — metadata, OG images, structured data, hreflang
- [app/docs/components/Mermaid.tsx](app/docs/components/Mermaid.tsx) — client component for Mermaid diagrams
- [mdx-components.tsx](mdx-components.tsx) — MDX element overrides (table whitespace fix)

MDX config: `experimental.mdxRs: { mdxType: 'gfm' }` in [next.config.ts](next.config.ts) — uses the Rust MDX compiler with GFM (tables, strikethrough) enabled.

