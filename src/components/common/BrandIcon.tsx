import { siGithub, siLeetcode, siCodeforces } from 'simple-icons'
import type { SVGProps } from 'react'

// LinkedIn's mark is deliberately excluded from simple-icons (brand-
// guideline restriction), so it's a small hand-drawn approximation here —
// standard practice for a personal site linking to one's own profile.
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z'

const SIMPLE_ICON_PATHS = {
  github: siGithub.path,
  leetcode: siLeetcode.path,
  codeforces: siCodeforces.path,
  linkedin: LINKEDIN_PATH,
} as const

export type Brand = keyof typeof SIMPLE_ICON_PATHS

/** Monochrome brand mark (fill="currentColor") matching the site's quiet icon treatment. */
export function BrandIcon({ brand, ...props }: { brand: Brand } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d={SIMPLE_ICON_PATHS[brand]} />
    </svg>
  )
}
