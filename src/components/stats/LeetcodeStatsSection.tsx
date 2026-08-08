import { useLeetcodeDetails } from '@/hooks/useDetails'
import { ProfileTabs } from '@/components/layout/ProfileTabs'
import { LeetcodeDifficultyDonut } from '@/components/charts/LeetcodeDifficultyDonut'
import { StatTile } from './StatTile'
import { Present } from '@/components/common/Present'
import { Chip } from '@/components/common/Chip'
import { QueryError } from '@/components/common/QueryError'
import { Skeleton } from '@/components/ui/skeleton'

export function LeetcodeStatsSection() {
  const { data, isLoading, isError, refetch } = useLeetcodeDetails()

  if (isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />
  if (isError) return <QueryError onRetry={refetch} />
  if (!data?.length) return null

  return (
    <ProfileTabs items={data} getKey={(a) => a.username} getLabel={(a) => a.username}>
      {(account) => {
        const hasDifficultySplit =
          account.easySolved !== undefined ||
          account.mediumSolved !== undefined ||
          account.hardSolved !== undefined
        const topLanguages = Object.entries(account.languageProblemsSolved)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)

        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[220px_1fr]">
            {hasDifficultySplit ? (
              <LeetcodeDifficultyDonut
                easy={account.easySolved ?? 0}
                medium={account.mediumSolved ?? 0}
                hard={account.hardSolved ?? 0}
              />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                No solved-count data
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Present value={account.ranking}>
                  {(v) => <StatTile label="Global ranking" value={`#${v.toLocaleString()}`} />}
                </Present>
                <Present value={account.contestRating}>
                  {(v) => <StatTile label="Contest rating" value={Math.round(v)} />}
                </Present>
                <Present value={account.contestGlobalRanking}>
                  {(v) => <StatTile label="Contest rank" value={`#${v.toLocaleString()}`} />}
                </Present>
                <Present value={account.currentStreak}>
                  {(v) => <StatTile label="Current streak" value={`${v}d`} />}
                </Present>
                <Present value={account.totalActiveDays}>
                  {(v) => <StatTile label="Active days" value={v} />}
                </Present>
                <Present value={account.reputation}>{(v) => <StatTile label="Reputation" value={v} />}</Present>
              </div>

              {topLanguages.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    Top languages
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topLanguages.map(([lang, count]) => (
                      <Chip key={lang} className="text-xs">
                        {lang} · {count}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              <Present value={account.badges}>
                {(badges) =>
                  badges.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                        Badges
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge) => (
                          <Chip key={badge} className="text-xs">
                            {badge}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )
                }
              </Present>
            </div>
          </div>
        )
      }}
    </ProfileTabs>
  )
}
