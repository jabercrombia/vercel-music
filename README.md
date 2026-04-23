# Global Music Trends

Real-time music charts personalized by country and language, powered by the Last.fm API and Vercel Edge.

## How it works

When a visitor hits `/`, Vercel Edge Middleware (`proxy.ts`) reads their country from the `x-vercel-ip-country` header and their preferred language from `Accept-Language`, then rewrites the request directly to `/[locale]/trends/[country]` — no redirect, no round-trip. Chart data is cached with ISR and regenerated in the background once per hour.

Clicking an artist opens an internal page (`/[locale]/artist/[name]`) with bio, top tracks, genre tags, and similar artists. The bio is translated by Last.fm using the active locale.

## Tech stack

- **Next.js 16** (App Router, ISR, React Suspense)
- **Vercel** — edge middleware, ISR cache
- **Last.fm API** — chart data and artist info
- **next-intl** — locale routing and UI translations (`en`, `es`, `fr`, `no`, `it`)
- **Tailwind CSS v4**
- **TypeScript**

## Getting started

**1. Get a Last.fm API key**

Create a free key at [last.fm/api/account/create](https://www.last.fm/api/account/create).

**2. Add your key to `.env.local`**

```bash
LASTFM_API_KEY=your_api_key_here
```

**3. Install and run**

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/en/trends/united-states` (locale and country are detected automatically on Vercel; local dev defaults to US/English).

## Supported countries and locales

| Country | Slug | Locale |
|---|---|---|
| United States | `united-states` | `en` |
| United Kingdom | `united-kingdom` | `en` |
| Australia | `australia` | `en` |
| Mexico | `mexico` | `es` |
| Spain | `spain` | `es` |
| Norway | `norway` | `no` |
| Italy | `italy` | `it` |
| France | `france` | `fr` |

## Routes

| Route | Description |
|---|---|
| `/` | Edge rewrite to `/[locale]/trends/[country]` |
| `/[locale]/trends/[country]` | Top tracks and artists for a country |
| `/[locale]/artist/[name]` | Artist detail — bio, top tracks, similar artists |

## Docs

Full documentation is available at `/docs/` (served by Next.js MDX from `app/docs/`).

| Route | Source | Description |
|---|---|---|
| `/docs` | [app/docs/page.mdx](app/docs/page.mdx) | Landing page |
| `/docs/overview` | [app/docs/overview/page.mdx](app/docs/overview/page.mdx) | Problem, solution, and key decisions |
| `/docs/architecture` | [app/docs/architecture/page.mdx](app/docs/architecture/page.mdx) | Tech stack, system diagram, i18n, and caching |
| `/docs/api` | [app/docs/api/page.mdx](app/docs/api/page.mdx) | Endpoints, types, and environment variables |
| `/docs/seo` | [app/docs/seo/page.mdx](app/docs/seo/page.mdx) | Metadata, OG images, structured data, hreflang |

To add a new doc page, create `app/docs/<name>/page.mdx` and add the route to the nav in `app/docs/layout.tsx`.

## Deployment

Deploy to Vercel with one command:

```bash
vercel deploy
```

Set `LASTFM_API_KEY` in **Vercel Dashboard → Project → Settings → Environment Variables**. Edge middleware runs automatically — no extra configuration needed.
