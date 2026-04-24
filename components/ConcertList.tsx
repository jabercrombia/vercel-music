import { Concert } from '@/lib/ticketmaster'

function formatDate(dateStr: string, timeStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T${timeStr ?? '00:00'}`)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ConcertList({ concerts }: { concerts: Concert[] }) {
  if (concerts.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Upcoming Concerts</h2>
      <ol className="space-y-2">
        {concerts.map((concert) => (
          <li key={concert.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-zinc-900">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{concert.venue}</p>
              <p className="text-zinc-400 text-xs truncate">
                {[concert.city, concert.country].filter(Boolean).join(', ')}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-zinc-300 text-sm">{formatDate(concert.date, concert.time)}</p>
              <a
                href={concert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Tickets →
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
