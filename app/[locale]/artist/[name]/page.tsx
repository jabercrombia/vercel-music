import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getArtistInfo, getArtistTopTracks } from '@/lib/lastfm'
import { notFound } from 'next/navigation'

export const revalidate = 3600

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
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return `${num}`
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; name: string }>
}) {
  const { name } = await params
  return { title: `${decodeURIComponent(name)} — Global Music Trends` }
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ locale: string; name: string }>
}) {
  const { locale, name } = await params
  const artistName = decodeURIComponent(name)
  const t = await getTranslations('Artist')

  const [artist, topTracks] = await Promise.all([
    getArtistInfo(artistName, locale),
    getArtistTopTracks(artistName),
  ])

  if (!artist) notFound()

  const imageUrl = getLargestImage(artist.image)
  const bio = stripHtml(artist.bio?.summary ?? '')
  const similar = artist.similar?.artist?.slice(0, 5) ?? []
  const tags = artist.tags?.tag?.slice(0, 5) ?? []

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
          {t('back')}
        </Link>

        {/* Hero */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mt-4">
          <div className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
            {imageUrl ? (
              <Image src={imageUrl} alt={artist.name} fill className="object-cover" sizes="160px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl text-zinc-600">🎤</div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{artist.name}</h1>
            <div className="flex gap-4 text-muted-foreground text-sm">
              <span>{t('listeners', { count: formatNum(artist.listeners) })}</span>
              <span>{t('plays', { count: formatNum(artist.playcount) })}</span>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span key={tag.name} className="px-2 py-0.5 bg-muted rounded text-xs text-foreground/70">
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
            <h2 className="text-lg font-semibold mb-2">{t('about')}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{bio}</p>
          </section>
        )}

        {/* Top Tracks */}
        {topTracks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">{t('topTracks')}</h2>
            <ol className="space-y-2">
              {topTracks.map((track, i) => (
                <li key={`${track.name}-${i}`} className="flex items-center gap-4 p-3 rounded-lg bg-card">
                  <span className="text-muted-foreground text-sm font-mono w-6 text-right shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">{track.name}</p>
                  </div>
                  {'playcount' in track && (
                    <span className="text-muted-foreground text-xs shrink-0 hidden sm:block">
                      {t('plays', { count: formatNum((track as { playcount: string }).playcount) })}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Similar Artists */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">{t('similarArtists')}</h2>
            <div className="flex flex-wrap gap-3">
              {similar.map((s) => (
                <Link
                  key={s.name}
                  href={`/artist/${encodeURIComponent(s.name)}`}
                  className="px-4 py-2 bg-card hover:bg-muted rounded-lg text-sm text-foreground transition-colors"
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
