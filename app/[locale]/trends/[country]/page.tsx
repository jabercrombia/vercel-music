import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getTopTracks, getTopArtists } from '@/lib/lastfm'
import { countryDisplayNames } from '@/lib/countries'
import { routing } from '@/i18n/routing'
import NowTrendingHero from '@/components/NowTrendingHero'
import CountrySelector from '@/components/CountrySelector'
import TrackList from '@/components/TrackList'
import ArtistGrid from '@/components/ArtistGrid'
import TrackSkeleton from '@/components/TrackSkeleton'

export const revalidate = 3600

export function generateStaticParams() {
  return Object.keys(countryDisplayNames).flatMap((country) =>
    routing.locales.map((locale) => ({ locale, country }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>
}) {
  const { locale, country } = await params
  const t = await getTranslations({ locale, namespace: 'Hero' })
  const displayName = countryDisplayNames[country] ?? country
  const title = t('heading', { country: displayName })
  const description = `Top trending tracks and artists in ${displayName}. Real-time music charts powered by Last.fm.`
  const url = `/${locale}/trends/${country}`

  const alternateLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/trends/${country}`])
  )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website' as const,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
  }
}

export default async function TrendsPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>
}) {
  const { country } = await params
  const t = await getTranslations('Charts')

  const [tracks, artists] = await Promise.all([
    getTopTracks(country),
    getTopArtists(country),
  ])

  const hasData = tracks.length > 0 || artists.length > 0

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <NowTrendingHero country={country} />
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-12">
        <CountrySelector current={country} />
        {!hasData ? (
          <p className="text-zinc-400 text-center py-20 text-lg">{t('noData')}</p>
        ) : (
          <>
            <Suspense fallback={<TrackSkeleton />}>
              <TrackList tracks={tracks} />
            </Suspense>
            <Suspense
              fallback={
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-zinc-800 rounded-lg h-48 animate-pulse" />
                  ))}
                </div>
              }
            >
              <ArtistGrid artists={artists} />
            </Suspense>
          </>
        )}
      </div>
    </main>
  )
}
