import type { ProfileProject } from '@/api/types'

export type Touchpoint =
  | { type: 'leetcode' }
  | { type: 'codeforces' }
  | { type: 'github' }
  | { type: 'project'; name: string }

const PATTERNS = {
  leetcode: /leetcode/i,
  codeforces: /codeforces|\bcf\s*rating/i,
  github: /\bgithub\b|\brepos?(itory|itories)?\b/i,
} as const

/**
 * The chat API returns plain text with no metadata about which knowledge
 * domain the AI used, so touch points are inferred client-side by scanning
 * the reply for known domain/project mentions.
 */
export function classifyTouchpoints(text: string, projects: ProfileProject[] = []): Touchpoint[] {
  const touchpoints: Touchpoint[] = []

  if (PATTERNS.leetcode.test(text)) touchpoints.push({ type: 'leetcode' })
  if (PATTERNS.codeforces.test(text)) touchpoints.push({ type: 'codeforces' })
  if (PATTERNS.github.test(text)) touchpoints.push({ type: 'github' })

  for (const project of projects) {
    if (project.name && text.toLowerCase().includes(project.name.toLowerCase())) {
      touchpoints.push({ type: 'project', name: project.name })
    }
  }

  // Cap so a message that happens to mention everything doesn't flood the reply.
  return touchpoints.slice(0, 3)
}
