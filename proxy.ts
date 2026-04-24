import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { isoToLastfm } from './lib/countries'

const intlMiddleware = createMiddleware(routing)

// Maps IP country ISO code to a supported locale as a fallback.
const isoToLocale: Record<string, string> = {
  DE: 'de',
  AT: 'de',
  CH: 'de',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  FR: 'fr',
  BE: 'fr',
  NO: 'no',
  IT: 'it',
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/') {
    // Detect country and locale at the edge, then rewrite directly to the trends page.
    // This avoids a two-step redirect (/ → /[locale] → /[locale]/trends/[country]).
    const isoCode = req.headers.get('x-vercel-ip-country') ?? 'US' //get isoCode
    const countrySlug = isoToLastfm[isoCode] ?? 'united-states' // get country name
    const locale = detectLocale(req, isoCode) 

    const url = req.nextUrl.clone()
    url.pathname = `/${locale}/trends/${countrySlug}`
    return NextResponse.rewrite(url)
  }

  return intlMiddleware(req)
}

function detectLocale(req: NextRequest, isoCode: string): string {
  // IP country takes priority — the app is geo-focused so location drives locale.
  if (isoToLocale[isoCode]) return isoToLocale[isoCode]

  // Fall back to Accept-Language when the IP country has no locale mapping (e.g. US, GB).
  // This is available in every browser
  const acceptLang = req.headers.get('accept-language') ?? ''
  const preferred = acceptLang
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: tag.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1.0 }
    })
    .sort((a, b) => b.q - a.q)
    .map(({ lang }) => lang)

  // Loop through the user's languages in priority order (highest q score first).
  // Return the first language the app supports. If none match, fall back to the default locale (en).
  // Example: user sends ['fr', 'en'] → returns 'fr'. User sends ['ja', 'zh'] → returns 'en'.
  for (const lang of preferred) {
    if ((routing.locales as readonly string[]).includes(lang)) return lang
  }

  return routing.defaultLocale
}

// Run middleware only on the root URL and locale-prefixed routes.
// Skips static files, images, and internal Next.js paths (_next/*).
export const config = {
  matcher: ['/', '/(en|es|no|it|fr|de)/:path*'],
}
