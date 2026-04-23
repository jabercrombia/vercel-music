import { getTranslations } from 'next-intl/server'
import type { Track } from '@/lib/lastfm'

function formatListeners(n: string) {
  const num = parseInt(n, 10)
  if (isNaN(num)) return n
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return `${num}`
}

export default async function TrackList({ tracks }: { tracks: Track[] }) {
  if (tracks.length === 0) return null
  const t = await getTranslations('Charts')

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">{t('topTracks')}</h2>
      <ol className="space-y-2">
        {tracks.map((track, i) => (
          <li key={`${track.name}-${i}`}>
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
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
                {formatListeners(track.listeners)}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
