import { Star, GitFork } from 'lucide-react'
import { useGitHubDetails } from '@/hooks/useDetails'
import { ProfileTabs } from '@/components/layout/ProfileTabs'
import { StatTile } from './StatTile'
import { Present } from '@/components/common/Present'
import { QueryError } from '@/components/common/QueryError'
import { Skeleton } from '@/components/ui/skeleton'

export function GithubStatsSection() {
  const { data, isLoading, isError, refetch } = useGitHubDetails()

  if (isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />
  if (isError) return <QueryError onRetry={refetch} />
  if (!data?.length) return null

  return (
    <ProfileTabs items={data} getKey={(a) => a.username} getLabel={(a) => a.username}>
      {(account) => {
        const topRepos = [...account.repositories].sort((a, b) => b.stars - a.stars).slice(0, 6)

        return (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img
                src={account.avatarUrl}
                alt={account.username}
                className="size-12 rounded-full border border-border"
              />
              <div>
                <p className="font-medium">{account.name ?? account.username}</p>
                <a
                  href={account.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-signal"
                >
                  @{account.username}
                </a>
              </div>
            </div>

            <Present value={account.bio}>{(bio) => <p className="text-sm text-muted-foreground">{bio}</p>}</Present>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatTile label="Public repos" value={account.publicRepos} />
              <StatTile label="Followers" value={account.followers} />
              <StatTile label="Following" value={account.following} />
            </div>

            {topRepos.length > 0 && (
              <div className="flex min-w-0 flex-col gap-2">
                {topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-signal/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{repo.name}</p>
                      <Present value={repo.description}>
                        {(desc) => <p className="truncate text-xs text-muted-foreground">{desc}</p>}
                      </Present>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-muted-foreground">
                      <Present value={repo.language}>{(lang) => <span>{lang}</span>}</Present>
                      <span className="flex items-center gap-1">
                        <Star className="size-3.5" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="size-3.5" />
                        {repo.forks}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      }}
    </ProfileTabs>
  )
}
