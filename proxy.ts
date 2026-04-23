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
    const isoCode = req.headers.get('x-vercel-ip-country') ?? 'US'
    const countrySlug = isoToLastfm[isoCode] ?? 'united-states'
    const locale = detectLocale(req, isoCode)

    const url = req.nextUrl.clone()
    url.pathname = `/${locale}/trends/${countrySlug}`
    return NextResponse.rewrite(url)
  }

  return intlMiddleware(req)
}

function detectLocale(req: NextRequest, isoCode: string): string {
  const acceptLang = req.headers.get('accept-language') ?? ''
  // Parse "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7" into primary language tags sorted by quality.
  // A plain includes() check incorrectly matches "en" inside "fr-FR,...,en-US" strings.
  const preferred = acceptLang
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: tag.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1.0 }
    })
    .sort((a, b) => b.q - a.q)
    .map(({ lang }) => lang)

  for (const lang of preferred) {
    if ((routing.locales as readonly string[]).includes(lang)) return lang
  }

  // Fall back to locale inferred from IP country when Accept-Language has no match.
  return isoToLocale[isoCode] ?? routing.defaultLocale
}

// Run middleware only on the root URL and locale-prefixed routes.
// Skips static files, images, and internal Next.js paths (_next/*).
export const config = {
  matcher: ['/', '/(en|es|no|it|fr|de)/:path*'],
}
