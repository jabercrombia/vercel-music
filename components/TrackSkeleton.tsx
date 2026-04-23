export default function TrackSkeleton() {
  return (
    <section>
      <div className="h-7 w-32 bg-zinc-800 rounded animate-pulse mb-4" />
      <ol className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900">
            <div className="w-6 h-4 bg-zinc-700 rounded animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-700 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
            </div>
            <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse hidden sm:block" />
          </li>
        ))}
      </ol>
    </section>
  )
}
