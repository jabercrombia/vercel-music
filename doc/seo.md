# SEO

## Goals

- Every trends page and artist page is indexable and returns meaningful metadata to crawlers.
- Social shares (Twitter/X, Slack, iMessage) show a rich preview card with a title, description, and generated image.
- Google understands which locale is canonical for each URL and avoids treating locale variants as duplicate content.
- Structured data enables rich results for artist pages in Google Search.

---

## Implemented

### `metadataBase`
Set in `app/layout.tsx`. Required for Next.js to resolve relative OG image URLs into absolute URLs. Without it, social crawlers receive relative paths they cannot fetch.

```ts
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-music.vercel.app')
```

Set `NEXT_PUBLIC_SITE_URL` in your Vercel environment variables to the production domain.

### Title template
Also in `app/layout.tsx`. Inner pages supply only their own title; the suffix is appended automatically.

```ts
title: { template: '%s — Global Music Trends', default: 'Global Music Trends' }
```

### Per-page `generateMetadata`
Both dynamic route types produce page-specific metadata:

| Field | Trends page | Artist page |
|---|---|---|
| `title` | "Trending in {Country}" | Artist name |
| `description` | "Top trending tracks and artists in {Country}…" | First 155 chars of Last.fm bio |
| `openGraph.type` | `website` | `profile` |
| `openGraph.images` | — | Artist image from Last.fm |
| `twitter.card` | `summary_large_image` | `summary_large_image` or `summary` |

### Canonical URLs
Each page sets `alternates.canonical` to its own locale-prefixed path. This prevents Google from choosing an arbitrary URL as canonical when the same content is reachable under multiple locales.

### hreflang alternate links
Each page sets `alternates.languages` with an entry for every supported locale pointing to the equivalent locale-prefixed URL. This tells Google that `/en/trends/france` and `/fr/trends/france` are translations of the same page, not duplicates.

Supported locales: `en`, `es`, `no`, `it`, `fr`.

### JSON-LD structured data (artist pages)
Artist pages emit a `MusicGroup` schema block in the `<head>`. Fields populated:

- `name` — artist name
- `description` — stripped bio text
- `image` — largest available Last.fm image
- `url` — Last.fm artist URL
- `genre` — up to 5 genre tags

This enables Google to display rich results (genre, image) directly in search.

### Generated OG images
Both route types have a co-located `opengraph-image.tsx` that renders a 1200×630 PNG at request time using `next/og`:

- **Trends pages** — dark background, country flag emoji, country name, site name.
- **Artist pages** — dark background, artist name, site name.

These images are statically generated at build time for pre-rendered routes and cached by Next.js.

### `generateStaticParams` (trends pages)
All 40 locale × country combinations are pre-rendered at build time. Crawlers always receive fully rendered HTML with no ISR wait on first visit.

---

## Environment variable

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute base URL used in `metadataBase`, canonical links, and OG image URLs. Must be set in Vercel project settings for production. |

---

## Not implemented / future work

| Item | Notes |
|---|---|
| `sitemap.xml` | Removed for now. Can be re-added with `app/sitemap.ts` enumerating all locale × country trend pages. Artist pages would need a known-list or top-N approach since the full set is unbounded. |
| `robots.txt` | Removed for now. Can be re-added with `app/robots.ts`. |
| Artist `generateStaticParams` | Not feasible without a bounded artist list. ISR handles on-demand generation. |
| Breadcrumb structured data | Could be added to trends and artist pages to improve SERP display. |
| OG image with artist photo | Currently the artist OG image is text-only. Fetching the Last.fm image and compositing it requires `fetch` inside `opengraph-image.tsx`, which is supported but adds latency. |
