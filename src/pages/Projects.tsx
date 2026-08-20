import { useProfileDetails } from '@/hooks/useDetails'
import { Reveal } from '@/components/common/Reveal'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { QueryError } from '@/components/common/QueryError'
import { Skeleton } from '@/components/ui/skeleton'

export function Projects() {
  const { data: profile, isLoading, isError, refetch } = useProfileDetails()
  const projects = profile?.projects ?? []

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-16 sm:py-24">
      <Reveal>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-3 text-muted-foreground">Things I've built.</p>
      </Reveal>

      {isLoading && (
        <div className="mt-12 columns-1 gap-5 sm:columns-2 xl:columns-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="mb-5 break-inside-avoid">
              <Skeleton className={i % 2 === 0 ? 'h-52 w-full rounded-2xl' : 'h-40 w-full rounded-2xl'} />
            </div>
          ))}
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
        <div className="mt-12 columns-1 gap-5 sm:columns-2 xl:columns-3">
          {projects.map((project, i) => (
            <div key={project.name ?? i} className="mb-5 break-inside-avoid">
              <Reveal delay={Math.min(i * 0.05, 0.3)}>
                <ProjectCard project={project} />
              </Reveal>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
