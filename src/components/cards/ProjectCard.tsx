import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Chip } from '@/components/common/Chip'
import { Present } from '@/components/common/Present'
import type { ProfileProject } from '@/api/types'

export function ProjectCard({ project }: { project: ProfileProject }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 300, damping: 25 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 300, damping: 25 })
  const glowX = useTransform(x, (v) => `${v * 100}%`)
  const glowY = useTransform(y, (v) => `${v * 100}%`)
  const glowBackground = useTransform(
    [glowX, glowY],
    ([gx, gy]) =>
      `radial-gradient(200px circle at ${gx} ${gy}, color-mix(in oklch, var(--signal) 15%, transparent) 0%, transparent 70%)`,
  )

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  const resetTilt = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowBackground }}
      />

      <div className="relative flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold">{project.name}</h3>
        <Present value={project.year}>
          {(year) => <span className="shrink-0 font-mono text-xs text-muted-foreground">{year}</span>}
        </Present>
      </div>

      <Present value={project.description}>
        {(desc) => (
          <ul className="relative mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
            {desc.map((d, i) => (
              <li key={i} className="list-disc pl-4 marker:text-border">
                {d}
              </li>
            ))}
          </ul>
        )}
      </Present>

      <Present value={project.technologies}>
        {(techs) => (
          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {techs.map((t) => (
              <Chip key={t} className="py-0.5 text-xs">
                {t}
              </Chip>
            ))}
          </div>
        )}
      </Present>
    </motion.div>
  )
}
