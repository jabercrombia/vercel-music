import TrackSkeleton from '@/components/TrackSkeleton'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="h-40 bg-card animate-pulse" />
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-12 pt-8">
        <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
        <TrackSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
