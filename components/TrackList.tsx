import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Track } from '@/lib/lastfm'
import { formatCount } from '@/lib/format'

export default async function TrackList({ tracks }: { tracks: Track[] }) {
  if (tracks.length === 0) return null
  const t = await getTranslations('Charts')

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">{t('topTracks')}</h2>
      <ol className="space-y-2">
        {tracks.map((track, i) => (
          <li key={`${track.name}-${i}`}>
            <Link
              href={`/artist/${encodeURIComponent(track.artist.name)}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors group"
            >
              <span className="text-zinc-500 text-sm font-mono w-6 text-right shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate group-hover:text-[#e4132d] transition-colors">
                  {track.name}
                </p>
                <p className="text-zinc-400 text-sm truncate">{track.artist.name}</p>
              </div>
              <span className="text-zinc-500 text-xs shrink-0 hidden sm:block">
                {formatCount(track.listeners)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
