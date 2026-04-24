import { Suspense } from 'react'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getArtistInfo } from '@/lib/lastfm'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import ArtistTopTracks, { TracksSkeleton } from '@/components/ArtistTopTracks'
import ArtistConcerts, { ConcertsSkeleton } from '@/components/ArtistConcerts'

function getLargestImage(images: { '#text': string; size: string }[]): string {
  for (const size of ['extralarge', 'large', 'medium', 'small']) {
    const img = images.find((i) => i.size === size)
    if (img?.['#text']) return img['#text']
  }
  return ''
}

function formatNum(n: string) {
  const num = parseInt(n, 10)
  if (isNaN(num)) return n
  if (num >= 1_000_000) {
    const val = num / 1_000_000
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`
  }
  if (num >= 1_000) return `${Math.round(num / 1_000)}K`
  return num.toLocaleString()
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function cleanBio(text: string): string {
  // Last.fm appends "Read more on Last.fm." — remove it so we can link manually
  return text.replace(/\s*read more on last\.fm\.?\s*$/i, '').trim()
}

export async function generateMetadata({
  params,
}: {
  // Next.js 15+: params is a Promise and must be awaited before use
  params: Promise<{ locale: string; name: string }>
}) {
  const { locale, name } = await params
  const artistName = decodeURIComponent(name)
  // Next.js deduplicates identical fetch calls within the same render, so this
  // doesn't make a second network request — it shares the cache with the page render
  const artist = await getArtistInfo(artistName, locale)
  const imageUrl = artist ? getLargestImage(artist.image) : ''
  const rawBio = artist ? stripHtml(artist.bio?.summary ?? '') : ''
  const description = rawBio
    ? rawBio.slice(0, 155) + (rawBio.length > 155 ? '…' : '')
    : `Discover ${artistName}'s top tracks and biography on Global Music Trends.`

  const title = artistName
  const url = `/${locale}/artist/${name}`

  const alternateLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/artist/${name}`])
  )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'profile' as const,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 300, height: 300, alt: artistName }],
      }),
    },
    twitter: {
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
  }
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ locale: string; name: string }>
}) {
  const { locale, name } = await params
  setRequestLocale(locale)
  const artistName = decodeURIComponent(name)
  const t = await getTranslations('Artist')

  // Only getArtistInfo blocks the hero — tracks and concerts stream in via Suspense
  const artist = await getArtistInfo(artistName, locale)

  if (!artist) notFound()

  const imageUrl = getLargestImage(artist.image)
  const bio = cleanBio(stripHtml(artist.bio?.summary ?? ''))
  const similar = artist.similar?.artist?.slice(0, 5) ?? []
  const tags = artist.tags?.tag?.slice(0, 5) ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name,
    ...(bio && { description: bio }),
    ...(imageUrl && { image: imageUrl }),
    ...(artist.url && { url: artist.url }),
    ...(tags.length > 0 && { genre: tags.map((tag) => tag.name) }),
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        <Link href="/" className="text-zinc-500 hover:text-white text-sm transition-colors">
          {t('back')}
        </Link>

        {/* Hero */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mt-4">
          <div className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden bg-muted">
            {imageUrl ? (
              <Image src={imageUrl} alt={artist.name} fill className="object-cover" sizes="160px" loading="eager" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl text-muted-foreground">🎤</div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{artist.name}</h1>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span key={tag.name} className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-300">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <section>
            <h2 className="text-lg font-semibold mb-4">{t('about')}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{bio}</p>

            {/* Stat cards */}
            {(() => {
              const listeners = parseInt(artist.stats.listeners, 10)
              const plays = parseInt(artist.stats.playcount, 10)
              const ratio = listeners > 0 ? (plays / listeners).toFixed(1) : null
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                  <div className="bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{t('listenersLabel')}</p>
                    <p className="text-white font-bold text-xl">{formatNum(artist.stats.listeners)}</p>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{t('playsLabel')}</p>
                    <p className="text-white font-bold text-xl">{formatNum(artist.stats.playcount)}</p>
                  </div>
                  {ratio && (
                    <div className="bg-zinc-900 rounded-lg p-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{t('playsPerListener')}</p>
                      <p className="text-white font-bold text-xl">{ratio} <span className="text-xs font-normal text-zinc-400">{t('perListen')}</span></p>
                    </div>
                  )}
                </div>
              )
            })()}

          </section>
        )}

        {/* Top Tracks — streams in independently */}
        <Suspense fallback={<TracksSkeleton />}>
          <ArtistTopTracks artistName={artistName} playsLabel={t('playsLabel')} />
        </Suspense>

        {/* Concerts — streams in independently */}
        <Suspense fallback={<ConcertsSkeleton />}>
          <ArtistConcerts artistName={artistName} />
        </Suspense>

        {/* Similar Artists */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">{t('similarArtists')}</h2>
            <div className="flex flex-wrap gap-3">
              {similar.map((s) => (
                <Link
                  key={s.name}
                  href={`/artist/${encodeURIComponent(s.name)}`}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm text-white transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
