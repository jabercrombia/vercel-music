// The proxy (proxy.ts) rewrites "/" directly to "/[locale]/trends/[country]".
// This page is a fallback for direct visits to "/[locale]" without a country.
import { redirect } from 'next/navigation'

export default async function LocaleRoot({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect(`/${locale}/trends/united-states`)
}
