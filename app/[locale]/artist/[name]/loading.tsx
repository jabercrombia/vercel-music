export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="flex gap-6 items-start">
          <div className="w-40 h-40 shrink-0 rounded-lg bg-muted animate-pulse" />
          <div className="space-y-3 flex-1">
            <div className="h-9 w-64 bg-muted rounded animate-pulse" />
            <div className="h-4 w-40 bg-muted/50 rounded animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-5 w-16 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full max-w-2xl bg-muted/50 rounded animate-pulse" />
          <div className="h-4 w-3/4 max-w-2xl bg-muted/50 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
