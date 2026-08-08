import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function TouchpointShell({
  icon,
  title,
  href,
  children,
}: {
  icon: ReactNode
  title: string
  href: string
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15 }}
      className="w-full max-w-sm rounded-xl border border-border bg-card p-3.5"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          {icon}
          {title}
        </div>
        <Link
          to={href}
          className="flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-signal"
        >
          View more
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
      {children}
    </motion.div>
  )
}

export function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  )
}
