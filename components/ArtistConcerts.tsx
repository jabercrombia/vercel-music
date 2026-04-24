import { getConcerts } from '@/lib/ticketmaster'
import ConcertList from '@/components/ConcertList'

function ConcertsSkeleton() {
  return (
    <section>
      <div className="h-5 w-36 bg-zinc-700 rounded animate-pulse mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-zinc-900 rounded-lg animate-pulse" />
        ))}
      </div>
    </section>
  )
}

export { ConcertsSkeleton }

export default async function ArtistConcerts({ artistName }: { artistName: string }) {
  const concerts = await getConcerts(artistName)
  return <ConcertList concerts={concerts} />
}
