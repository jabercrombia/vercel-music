import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Artist } from '@/lib/lastfm'


// format the number output M/K
function formatListeners(n: string) {
  const num = parseInt(n, 10)
  if (isNaN(num)) return n
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return `${num}`
}

function getLargestImage(images: Artist['image']): string {
  const order = ['extralarge', 'large', 'medium', 'small']
  for (const size of order) {
    const img = images.find((i) => i.size === size)
    if (img?.['#text']) return img['#text']
  }
  return ''
}

export default async function ArtistGrid({ artists }: { artists: Artist[] }) {
  if (artists.length === 0) return null
  const t = await getTranslations('Charts')

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">{t('topArtists')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {artists.map((artist, i) => {
          const imageUrl = getLargestImage(artist.image)
          return (
            <Link
              key={`${artist.name}-${i}`}
              href={`/artist/${encodeURIComponent(artist.name)}`}
              className="group bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors"
            >
              <div className="relative aspect-square bg-zinc-800">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    // first 4 images are loaded as a priority rest are just lazy
                    loading={i < 4 ? 'eager' : 'lazy'}
                    priority={i < 4}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl text-zinc-600">
                    🎤
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white font-medium text-sm truncate group-hover:text-[#e4132d] transition-colors">
                  {artist.name}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {formatListeners(artist.listeners)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
