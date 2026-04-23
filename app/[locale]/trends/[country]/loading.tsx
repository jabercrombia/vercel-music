import TrackSkeleton from '@/components/TrackSkeleton'

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="h-40 bg-zinc-900 animate-pulse" />
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-12 pt-8">
        <div className="h-10 w-48 bg-zinc-800 rounded-lg animate-pulse" />
        <TrackSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
