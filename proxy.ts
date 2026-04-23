import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { isoToLastfm } from './lib/countries'

const intlMiddleware = createMiddleware(routing)

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/') {
    // Detect country and locale at the edge, then rewrite directly to the trends page.
    // This avoids a two-step redirect (/ → /[locale] → /[locale]/trends/[country]).
    const isoCode = req.headers.get('x-vercel-ip-country') ?? 'US'
    const countrySlug = isoToLastfm[isoCode] ?? 'united-states'
    const locale = detectLocale(req)

    const url = req.nextUrl.clone()
    url.pathname = `/${locale}/trends/${countrySlug}`
    return NextResponse.rewrite(url)
  }

  return intlMiddleware(req)
}

function detectLocale(req: NextRequest): string {
  const acceptLang = req.headers.get('accept-language') ?? ''
  for (const locale of routing.locales) {
    if (acceptLang.toLowerCase().includes(locale)) return locale
  }
  return routing.defaultLocale
}

// Run middleware only on the root URL and locale-prefixed routes.
// Skips static files, images, and internal Next.js paths (_next/*).
export const config = {
  matcher: ['/', '/(en|es|no|it|fr|de)/:path*'],
}
