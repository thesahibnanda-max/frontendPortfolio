import { useProfileDetails } from '@/hooks/useDetails'
import { Reveal } from '@/components/common/Reveal'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { QueryError } from '@/components/common/QueryError'
import { Skeleton } from '@/components/ui/skeleton'

export function Projects() {
  const { data: profile, isLoading, isError, refetch } = useProfileDetails()
  const projects = profile?.projects ?? []

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-4 py-16 sm:py-24">
      <Reveal>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-3 text-muted-foreground">Things I've built.</p>
      </Reveal>

      {isLoading && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      )}

      {isError && (
        <div className="mt-12">
          <QueryError onRetry={refetch} />
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <p className="mt-12 text-muted-foreground">No projects listed yet.</p>
      )}

      {!isError && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.name ?? i} delay={Math.min(i * 0.05, 0.3)}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
