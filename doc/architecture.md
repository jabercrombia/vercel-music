# Architecture

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | ISR, Suspense streaming, edge middleware |
| Deployment | Vercel | Edge network, `x-vercel-ip-country` header, ISR support |
| Data | Last.fm Public API | Free, no auth for read endpoints, supports `lang` param |
| i18n | next-intl 4.x | Locale-in-URL routing, server + client component support |
| Language | TypeScript | Type-safe API responses and component props |
| Styling | Tailwind CSS v4 | Utility-first, dark theme, zero runtime |

## System Diagram

```
User Request
     │
     ▼
[Vercel Edge — proxy.ts]
  • Reads x-vercel-ip-country header  → ISO code (e.g. "NO")
  • Reads Accept-Language header       → locale (e.g. "no")
  • Maps ISO → country slug            → "norway"
  • Rewrites /  →  /no/trends/norway
     │
     ▼
[Next.js App Router]
  /[locale]/trends/[country]/page.tsx
  • ISR: revalidate 3600s
  • Fetches geo.getTopTracks + geo.getTopArtists in parallel
  • Renders NowTrendingHero, CountrySelector, TrackList, ArtistGrid
  • Streams with React Suspense
     │
     ▼
[Vercel Edge Cache]
  • Cached per (locale, country) pair
  • Stale-while-revalidate: serves instantly, regenerates in background
  • Manual override: CountrySelector pushes to /[locale]/trends/[newCountry]
```

## File Structure

```
/
├── proxy.ts                          # Edge: country + locale detection, rewrite
├── i18n/
│   ├── routing.ts                    # Supported locales + default
│   ├── request.ts                    # Server-side locale/message resolution
│   └── navigation.ts                 # Locale-aware Link, useRouter
├── messages/
│   ├── en.json                       # English UI strings
│   ├── es.json                       # Spanish
│   ├── no.json                       # Norwegian
│   └── it.json                       # Italian
├── lib/
│   ├── lastfm.ts                     # Last.fm API wrapper (typed, ISR fetch)
│   └── countries.ts                  # ISO → slug, display names, flag emojis
├── app/
│   ├── layout.tsx                    # Root layout (html, body, fonts)
│   └── [locale]/
│       ├── layout.tsx                # NextIntlClientProvider per locale
│       ├── page.tsx                  # Fallback: redirects to /[locale]/trends/united-states
│       ├── trends/[country]/
│       │   ├── page.tsx              # ISR chart page
│       │   └── loading.tsx           # Suspense skeleton
│       └── artist/[name]/
│           ├── page.tsx              # ISR artist page
│           └── loading.tsx           # Suspense skeleton
└── components/
    ├── NowTrendingHero.tsx           # Hero — server, uses getTranslations
    ├── CountrySelector.tsx           # Dropdown — client, uses useTranslations
    ├── TrackList.tsx                 # Track list — server, uses getTranslations
    ├── ArtistGrid.tsx                # Artist grid — server, uses getTranslations
    └── TrackSkeleton.tsx             # Animated loading skeleton
```

## i18n Strategy

Locale is determined once at the edge in `proxy.ts` and embedded in the URL path:

```
/en/trends/united-states
/es/trends/spain
/no/artist/Kygo
/it/artist/Måneskin
```

**Supported locales:** `en` (default), `es`, `no`, `it`

**Locale detection order for root `/`:**
1. `Accept-Language` request header matched against supported locales
2. Falls back to `en`

**For all other paths**, next-intl's middleware handles locale detection and redirects (e.g. `/trends/france` → `/en/trends/france`).

**Server components** call `getTranslations(namespace)` from `next-intl/server`.  
**Client components** call `useTranslations(namespace)` — messages are injected by `NextIntlClientProvider` in the locale layout.

**Artist bio translation** is handled by passing the locale code as the `lang` parameter to `artist.getInfo` on the Last.fm API. No local translation files are needed for content.

## Caching Strategy

| Route | Method | TTL | Cache Key |
|---|---|---|---|
| `/[locale]/trends/[country]` | ISR | 3600s | locale + country |
| `/[locale]/artist/[name]` | ISR | 3600s | locale + artist name |
| Last.fm fetch (tracks) | `next: { revalidate: 3600 }` | 3600s | full URL |
| Last.fm fetch (artists) | `next: { revalidate: 3600 }` | 3600s | full URL |
| Last.fm fetch (artist info) | `next: { revalidate: 3600 }` | 3600s | full URL + lang |

ISR means Vercel serves the cached page immediately and regenerates it in the background when the TTL expires. The first request after a cold deploy triggers a blocking render; all subsequent requests are served from cache until the TTL lapses.

## Rendering Strategy

| Concern | Approach | Why |
|---|---|---|
| Country detection | Edge (proxy.ts) | Zero latency, runs before any server code |
| Locale detection | Edge (proxy.ts) | Same pass as country, no extra round-trip |
| Chart data | ISR + fetch revalidate | Charts change hourly; caching saves API quota |
| Loading states | React Suspense + `loading.tsx` | Streams shell instantly, content fills in |
| Country switch | Client-side navigation | Instant UX, no full reload |
