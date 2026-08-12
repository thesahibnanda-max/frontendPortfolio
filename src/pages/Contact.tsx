import { Mail, MapPin, Download, Globe, ArrowUpRight } from 'lucide-react'
import { useProfessionalDetails, useProfileDetails } from '@/hooks/useDetails'
import { Present } from '@/components/common/Present'
import { Reveal } from '@/components/common/Reveal'
import { QueryError } from '@/components/common/QueryError'
import { BrandIcon } from '@/components/common/BrandIcon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ReactNode } from 'react'

function LinkRow({
  icon,
  label,
  href,
}: {
  icon: ReactNode
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-signal/40"
    >
      <span className="flex items-center gap-3 text-sm">
        <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-signal" />
    </a>
  )
}

function shortUrl(url: string) {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '') + (u.pathname !== '/' ? u.pathname : '')
  } catch {
    return url
  }
}

export function Contact() {
  const {
    data: professional,
    isLoading: profLoading,
    isError: profError,
    refetch: refetchProf,
  } = useProfessionalDetails()
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileErrorFlag,
    refetch: refetchProfile,
  } = useProfileDetails()

  if (profLoading || profileLoading) {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-4 px-4 py-20">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (profError || profileErrorFlag) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-2xl px-4 py-20">
        <QueryError onRetry={() => (profError ? refetchProf() : refetchProfile())} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl px-4 py-16 sm:py-24">
      <Reveal>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-3 text-muted-foreground">Let's talk.</p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Present value={profile?.profileDetails?.email}>
            {(email) => (
              <Button nativeButton={false} render={<a href={`mailto:${email}`} />}>
                <Mail className="size-4" />
                {email}
              </Button>
            )}
          </Present>
          <Present value={professional?.resumeLink}>
            {(link) => (
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={link} target="_blank" rel="noopener noreferrer" />}
              >
                <Download className="size-4" />
                Resume
              </Button>
            )}
          </Present>
          <Present value={profile?.countryName}>
            {(country) => (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {country}
              </span>
            )}
          </Present>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-10 flex flex-col gap-2.5">
          <Present value={profile?.linkedinUrl}>
            {(url) => <LinkRow icon={<BrandIcon brand="linkedin" className="size-4" />} label="LinkedIn" href={url} />}
          </Present>

          <Present value={professional?.twitterUrl ?? profile?.twitterUrl}>
            {(url) => <LinkRow icon={<BrandIcon brand="x" className="size-4" />} label={shortUrl(url)} href={url} />}
          </Present>

          <Present value={professional?.githubLinks}>
            {(links) =>
              links.map((url) => (
                <LinkRow
                  key={url}
                  icon={<BrandIcon brand="github" className="size-4" />}
                  label={shortUrl(url)}
                  href={url}
                />
              ))
            }
          </Present>

          <Present value={professional?.leetcodeLinks}>
            {(links) =>
              links.map((url) => (
                <LinkRow
                  key={url}
                  icon={<BrandIcon brand="leetcode" className="size-4" />}
                  label={shortUrl(url)}
                  href={url}
                />
              ))
            }
          </Present>

          <Present value={professional?.codeforcesLink}>
            {(links) =>
              links.map((url) => (
                <LinkRow
                  key={url}
                  icon={<BrandIcon brand="codeforces" className="size-4" />}
                  label={shortUrl(url)}
                  href={url}
                />
              ))
            }
          </Present>

          <Present value={professional?.websites ?? profile?.websites}>
            {(sites) =>
              sites.map((url) => (
                <LinkRow key={url} icon={<Globe className="size-4" />} label={shortUrl(url)} href={url} />
              ))
            }
          </Present>
        </div>
      </Reveal>
    </div>
  )
}
