import { useMemo } from 'react'
import { FolderGit2 } from 'lucide-react'
import { classifyTouchpoints, type Touchpoint } from '@/lib/touchpointClassifier'
import { useLeetcodeDetails, useCodeforcesDetails, useGitHubDetails, useProfileDetails } from '@/hooks/useDetails'
import { ProfileTabs } from '@/components/layout/ProfileTabs'
import { TouchpointShell, StatRow } from '@/components/cards/TouchpointShell'
import { Present } from '@/components/common/Present'
import { BrandIcon } from '@/components/common/BrandIcon'
import { Skeleton } from '@/components/ui/skeleton'

function LeetcodeTouchpoint() {
  const { data, isLoading } = useLeetcodeDetails()
  if (isLoading) return <Skeleton className="h-24 w-full max-w-sm rounded-xl" />
  if (!data?.length) return null

  return (
    <TouchpointShell icon={<BrandIcon brand="leetcode" className="size-4 text-difficulty-medium" />} title="LeetCode" href="/stats">
      <ProfileTabs items={data} getKey={(a) => a.username} getLabel={(a) => a.username}>
        {(account) => (
          <div className="flex flex-col gap-1">
            <Present value={account.totalSolved}>{(v) => <StatRow label="Solved" value={v} />}</Present>
            <Present value={account.ranking}>{(v) => <StatRow label="Ranking" value={`#${v.toLocaleString()}`} />}</Present>
            <Present value={account.contestRating}>{(v) => <StatRow label="Contest rating" value={Math.round(v)} />}</Present>
          </div>
        )}
      </ProfileTabs>
    </TouchpointShell>
  )
}

function CodeforcesTouchpoint() {
  const { data, isLoading } = useCodeforcesDetails()
  if (isLoading) return <Skeleton className="h-24 w-full max-w-sm rounded-xl" />
  if (!data?.length) return null

  return (
    <TouchpointShell icon={<BrandIcon brand="codeforces" className="size-4 text-rank-master" />} title="Codeforces" href="/stats">
      <ProfileTabs items={data} getKey={(a) => a.handle} getLabel={(a) => a.handle}>
        {(account) => (
          <div className="flex flex-col gap-1">
            <Present value={account.currentRating}>{(v) => <StatRow label="Current rating" value={v} />}</Present>
            <Present value={account.maxRating}>{(v) => <StatRow label="Max rating" value={v} />}</Present>
            <StatRow label="Contests" value={account.contestsCount} />
          </div>
        )}
      </ProfileTabs>
    </TouchpointShell>
  )
}

function GithubTouchpoint() {
  const { data, isLoading } = useGitHubDetails()
  if (isLoading) return <Skeleton className="h-24 w-full max-w-sm rounded-xl" />
  if (!data?.length) return null

  return (
    <TouchpointShell icon={<BrandIcon brand="github" className="size-4" />} title="GitHub" href="/stats">
      <ProfileTabs items={data} getKey={(a) => a.username} getLabel={(a) => a.username}>
        {(account) => (
          <div className="flex items-start gap-3">
            <img
              src={account.avatarUrl}
              alt={account.username}
              className="size-9 shrink-0 rounded-full border border-border"
            />
            <div className="flex flex-1 flex-col gap-1">
              <StatRow label="Public repos" value={account.publicRepos} />
              <StatRow label="Followers" value={account.followers} />
              <Present value={account.repositories[0]}>
                {(repo) => <StatRow label="Top repo" value={repo.name} />}
              </Present>
            </div>
          </div>
        )}
      </ProfileTabs>
    </TouchpointShell>
  )
}

function ProjectTouchpoint({ name }: { name: string }) {
  const { data } = useProfileDetails()
  const project = data?.projects?.find((p) => p.name === name)
  if (!project) return null

  return (
    <TouchpointShell icon={<FolderGit2 className="size-4" />} title={project.name ?? name} href="/projects">
      <div className="flex flex-col gap-1.5">
        <Present value={project.year}>{(v) => <StatRow label="Year" value={v} />}</Present>
        <Present value={project.technologies}>
          {(techs) => (
            <div className="flex flex-wrap gap-1 pt-1">
              {techs.slice(0, 4).map((tech) => (
                <span key={tech} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </Present>
      </div>
    </TouchpointShell>
  )
}

function renderTouchpoint(touchpoint: Touchpoint, i: number) {
  switch (touchpoint.type) {
    case 'leetcode':
      return <LeetcodeTouchpoint key={i} />
    case 'codeforces':
      return <CodeforcesTouchpoint key={i} />
    case 'github':
      return <GithubTouchpoint key={i} />
    case 'project':
      return <ProjectTouchpoint key={i} name={touchpoint.name} />
  }
}

export function MessageTouchpoints({ text }: { text: string }) {
  const { data: profile } = useProfileDetails()
  const touchpoints = useMemo(
    () => classifyTouchpoints(text, profile?.projects ?? []),
    [text, profile?.projects],
  )

  if (touchpoints.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {touchpoints.map((touchpoint, i) => renderTouchpoint(touchpoint, i))}
    </div>
  )
}
