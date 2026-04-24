import { getArtistTopTracks } from '@/lib/lastfm'

function TracksSkeleton() {
  return (
    <section>
      <div className="h-5 w-24 bg-zinc-700 rounded animate-pulse mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-zinc-900 rounded-lg animate-pulse" />
        ))}
      </div>
    </section>
  )
}

export { TracksSkeleton }

export default async function ArtistTopTracks({
  artistName,
  playsLabel,
}: {
  artistName: string
  playsLabel: string
}) {
  const topTracks = await getArtistTopTracks(artistName)

  if (topTracks.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Top Tracks</h2>
      <ol className="space-y-2">
        {topTracks.map((track, i) => (
          <li key={`${track.name}-${i}`} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900">
            <span className="text-zinc-500 text-sm font-mono w-6 text-right shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{track.name}</p>
            </div>
            {'listeners' in track && (
              <span className="text-zinc-500 text-xs shrink-0 hidden sm:block">
                {playsLabel}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
