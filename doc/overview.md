# Overview

## Problem

Music charts are global but taste is local. A visitor in Norway and a visitor in Mexico will see different tracks trending, yet most music sites serve the same homepage to everyone. Personalizing at the server level typically means slow, per-request rendering — or complex client-side logic after the page loads.

There is a second problem: language. Showing chart data in English to a Spanish or Italian speaker is a missed opportunity, but full i18n usually means routing complexity, duplicated pages, or heavy client-side bundles.

## Solution

**Global Music Trends** is a Next.js app deployed on Vercel that solves both problems at the edge:

1. **Country detection** happens in `proxy.ts` (Vercel Edge) before any server or client code runs. The visitor's ISO country code is read from the `x-vercel-ip-country` header and mapped to a Last.fm country name. The request is rewritten to `/[locale]/trends/[country]` with zero latency overhead.

2. **Locale detection** runs in the same proxy pass. The `Accept-Language` header is matched against supported locales (`en`, `es`, `no`, `it`) and prefixed into the URL. next-intl then serves translated UI strings for every page in that locale.

3. **Chart data is cached with ISR.** Each `/[locale]/trends/[country]` page is a separate cached entry, regenerated at most once per hour. Vercel serves stale HTML instantly and regenerates in the background — no cold starts for popular routes.

4. **Artist pages are a first-class experience** inside the app. Clicking an artist opens `/[locale]/artist/[name]` with bio (translated via Last.fm's `lang` param using the active locale), top tracks, genre tags, and similar artists — all ISR-cached and locale-aware.

## Key Decisions

### Edge rewrite over redirect
The proxy rewrites `/` directly to `/[locale]/trends/[country]` rather than redirecting. This avoids a round-trip (302 → 200) that would add latency on every cold visit.

### ISR over SSR
Chart rankings change on the order of hours, not seconds. ISR with `revalidate: 3600` means Vercel serves pre-rendered HTML instantly and only hits the Last.fm API in the background, once per hour per country. This keeps API quota low and Time to First Byte fast.

### Per-country cache isolation
`/en/trends/united-states` and `/es/trends/spain` are separate ISR entries. Each country and locale combination is cached and invalidated independently, so a spike in Spanish traffic does not bust the Norwegian cache.

### next-intl with locale-in-URL routing
Locale in the URL path (not a cookie or header) means:
- Each locale is a separately cached ISR page.
- Links are shareable and correct without JavaScript.
- next-intl's navigation helpers (`Link`, `useRouter`) keep the locale prefix transparent to component code.

### Last.fm for bio translation
Rather than maintaining translations for artist bios (which would be thousands of strings), we pass the active locale directly to Last.fm's `lang` parameter on `artist.getInfo`. Last.fm returns the bio in the requested language when available, falling back to English.
