import { useProfileDetails } from '@/hooks/useDetails'
import { Present } from '@/components/common/Present'
import { Reveal } from '@/components/common/Reveal'
import { Chip } from '@/components/common/Chip'
import { QueryError } from '@/components/common/QueryError'
import { Skeleton } from '@/components/ui/skeleton'

export function Skills() {
  const { data: profile, isLoading, isError, refetch } = useProfileDetails()

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-4 px-4 py-20">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-4xl px-4 py-20">
        <QueryError onRetry={refetch} />
      </div>
    )
  }

  const categories = profile?.skillsByCategory ? Object.entries(profile.skillsByCategory) : []

  const categoryLabel = (category: string) =>
    category.trim().toLowerCase() === 'languages' ? 'Programming Languages' : category

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl px-4 py-16 sm:py-24">
      <Reveal>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Skills</h1>
      </Reveal>

      {categories.length > 0 && (
        <section className="mt-12 flex flex-col gap-8">
          {categories.map(([category, skills], i) => (
            <Reveal key={category} delay={Math.min(i * 0.05, 0.3)}>
              <div>
                <h2 className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {categoryLabel(category)}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </section>
      )}

      <Present value={profile?.languages}>
        {(languages) => (
          <Reveal>
            <section className="mt-12">
              <h2 className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Languages I Speak
              </h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Chip key={lang}>{lang}</Chip>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={profile?.achievements}>
        {(achievements) => (
          <Reveal>
            <section className="mt-12">
              <h2 className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Achievements
              </h2>
              <ul className="flex flex-col gap-2">
                {achievements.map((achievement, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}
      </Present>
    </div>
  )
}
