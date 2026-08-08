import { usePersonalityDetails, useProfileDetails, useProfessionalDetails } from '@/hooks/useDetails'
import { Present } from '@/components/common/Present'
import { Reveal } from '@/components/common/Reveal'
import { Chip } from '@/components/common/Chip'
import { QueryError } from '@/components/common/QueryError'
import { ProfilePhotoCarousel } from '@/components/common/ProfilePhotoCarousel'
import { Skeleton } from '@/components/ui/skeleton'

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
      {children}
    </h2>
  )
}

export function About() {
  const {
    data: personality,
    isLoading: personalityLoading,
    isError: personalityError,
    refetch: refetchPersonality,
  } = usePersonalityDetails()
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useProfileDetails()
  const { data: professional } = useProfessionalDetails()

  const traits = personality?.personalProfile?.personality
  const interests = personality?.personalProfile?.interests
  const favorites = personality?.personalProfile?.favorites
  const spokenLanguages = personality?.personalProfile?.languages

  if (personalityLoading || profileLoading) {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4 px-4 py-20">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (personalityError || profileError) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-3xl px-4 py-20">
        <QueryError onRetry={() => (personalityError ? refetchPersonality() : refetchProfile())} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl px-4 py-16 sm:py-24">
      <Reveal>
        <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
              <Present value={profile?.profileDetails?.name}>{(name) => <>{name}</>}</Present>
            </h1>
            <Present value={personality?.aboutMe}>
              {(bio) => <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{bio}</p>}
            </Present>
          </div>
          <Present value={professional?.profilePhotoLink}>
            {(photos) => <ProfilePhotoCarousel photos={photos} className="size-24 sm:size-28" />}
          </Present>
        </div>
      </Reveal>

      <Present value={traits?.coreTraits}>
        {(items) => (
          <Reveal delay={0.05}>
            <section className="mt-14">
              <SectionHeading>Core traits</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={traits?.professionalTraits}>
        {(items) => (
          <Reveal delay={0.05}>
            <section className="mt-8">
              <SectionHeading>Professional traits</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={interests?.technology}>
        {(items) => (
          <Reveal delay={0.05}>
            <section className="mt-8">
              <SectionHeading>Technical interests</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={favorites?.movies}>
        {(movies) => (
          <Reveal delay={0.05}>
            <section className="mt-8">
              <SectionHeading>Favorite movies</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {movies.map((m, i) => (
                  <Chip key={i}>{m.title}</Chip>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={favorites?.games}>
        {(games) => (
          <Reveal delay={0.05}>
            <section className="mt-8">
              <SectionHeading>Favorite games</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {games.map((g, i) => (
                  <Chip key={i}>{g.title}</Chip>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={spokenLanguages}>
        {(langs) => (
          <Reveal delay={0.05}>
            <section className="mt-8">
              <SectionHeading>Languages</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {langs.map((l, i) => (
                  <Chip key={i}>
                    {l.name}
                    {l.proficiency ? ` · ${l.proficiency}` : ''}
                  </Chip>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={profile?.experience}>
        {(experiences) => (
          <Reveal>
            <section className="mt-16">
              <h2 className="mb-6 font-heading text-xl font-semibold">Experience</h2>
              <div className="flex flex-col gap-8">
                {experiences.map((exp, i) => (
                  <div key={i} className="border-l-2 border-border pl-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="font-medium">
                        {exp.title}
                        {exp.company ? ` · ${exp.company}` : ''}
                      </h3>
                      {exp.startDate && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {exp.startDate} – {exp.endDate ?? 'Present'}
                        </span>
                      )}
                    </div>
                    {(exp.location || exp.employmentType) && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {[exp.location, exp.employmentType].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <Present value={exp.description}>
                      {(desc) => (
                        <ul className="mt-2.5 flex flex-col gap-1 pl-4 text-sm">
                          {desc.map((d, di) => (
                            <li key={di} className="list-disc marker:text-muted-foreground">
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Present>
                    <Present value={exp.technologies}>
                      {(techs) => (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {techs.map((t) => (
                            <Chip key={t} className="py-0.5 text-xs">
                              {t}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </Present>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>

      <Present value={profile?.education}>
        {(educations) => (
          <Reveal>
            <section className="mt-16">
              <h2 className="mb-6 font-heading text-xl font-semibold">Education</h2>
              <div className="flex flex-col gap-6">
                {educations.map((edu, i) => (
                  <div key={i} className="border-l-2 border-border pl-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="font-medium">{edu.institution}</h3>
                      {edu.startDate && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {edu.startDate} – {edu.endDate ?? 'Present'}
                        </span>
                      )}
                    </div>
                    {(edu.degree || edu.field) && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {[edu.degree, edu.field].filter(Boolean).join(', ')}
                        {edu.grade ? ` · ${edu.grade}` : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Present>
    </div>
  )
}
