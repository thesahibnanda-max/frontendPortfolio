import { cn } from '@/lib/utils'

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
