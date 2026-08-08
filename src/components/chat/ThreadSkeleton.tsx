import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shown the instant a chat is selected but its messages haven't arrived
 * yet (GET /chats/{id} in flight, nothing cached) — without this, the
 * screen goes blank between click and response, which is exactly what
 * reads as "did my click even register."
 */
export function ThreadSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-background px-4 py-2.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-7 w-20 shrink-0 rounded-full" />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-4">
        <div className="flex justify-end">
          <Skeleton className="h-9 w-2/5 rounded-2xl" />
        </div>
        <Skeleton className="h-24 w-3/5 rounded-2xl" />
        <div className="flex justify-end">
          <Skeleton className="h-9 w-1/3 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
