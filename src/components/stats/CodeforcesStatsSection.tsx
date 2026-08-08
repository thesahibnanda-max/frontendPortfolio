import { useCodeforcesDetails } from '@/hooks/useDetails'
import { ProfileTabs } from '@/components/layout/ProfileTabs'
import { CodeforcesRatingChart } from '@/components/charts/CodeforcesRatingChart'
import { StatTile } from './StatTile'
import { Present } from '@/components/common/Present'
import { QueryError } from '@/components/common/QueryError'
import { Skeleton } from '@/components/ui/skeleton'

export function CodeforcesStatsSection() {
  const { data, isLoading, isError, refetch } = useCodeforcesDetails()

  if (isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />
  if (isError) return <QueryError onRetry={refetch} />
  if (!data?.length) return null

  return (
    <ProfileTabs items={data} getKey={(a) => a.handle} getLabel={(a) => a.handle}>
      {(account) => (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Present value={account.currentRating}>{(v) => <StatTile label="Current rating" value={v} />}</Present>
            <Present value={account.maxRating}>{(v) => <StatTile label="Max rating" value={v} />}</Present>
            <StatTile label="Contests" value={account.contestsCount} />
          </div>
          {account.ratingHistory.length > 0 ? (
            <CodeforcesRatingChart history={account.ratingHistory} />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              No rated contests yet
            </div>
          )}
        </div>
      )}
    </ProfileTabs>
  )
}
