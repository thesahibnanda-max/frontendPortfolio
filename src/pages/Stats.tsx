import { Reveal } from '@/components/common/Reveal'
import { BrandIcon, type Brand } from '@/components/common/BrandIcon'
import { LeetcodeStatsSection } from '@/components/stats/LeetcodeStatsSection'
import { CodeforcesStatsSection } from '@/components/stats/CodeforcesStatsSection'
import { GithubStatsSection } from '@/components/stats/GithubStatsSection'

function SectionCard({
  title,
  brand,
  children,
}: {
  title: string
  brand: Brand
  children: React.ReactNode
}) {
  return (
    <Reveal>
      <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
        <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-semibold">
          <BrandIcon brand={brand} className="size-5" />
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  )
}

export function Stats() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl px-4 py-16 sm:py-24">
      <Reveal>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Stats</h1>
        <p className="mt-3 text-muted-foreground">Live from LeetCode, Codeforces, and GitHub.</p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-6">
        <SectionCard title="LeetCode" brand="leetcode">
          <LeetcodeStatsSection />
        </SectionCard>
        <SectionCard title="Codeforces" brand="codeforces">
          <CodeforcesStatsSection />
        </SectionCard>
        <SectionCard title="GitHub" brand="github">
          <GithubStatsSection />
        </SectionCard>
      </div>
    </div>
  )
}
