import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Backend returns one array entry per configured account (LeetCode/
 * Codeforces/GitHub all support multiple handles). Renders a single view
 * directly when there's one entry, or a segmented switcher when there are
 * several — used consistently on /stats and in chat touch-point cards.
 */
export function ProfileTabs<T>({
  items,
  getKey,
  getLabel,
  children,
}: {
  items: T[]
  getKey: (item: T) => string
  getLabel: (item: T) => string
  children: (item: T) => ReactNode
}) {
  const [active, setActive] = useState(0)

  if (items.length === 0) return null
  if (items.length === 1) return <>{children(items[0])}</>

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <button
            key={getKey(item)}
            onClick={() => setActive(i)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
              i === active
                ? 'border-transparent bg-secondary text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {getLabel(item)}
          </button>
        ))}
      </div>
      {children(items[active])}
    </div>
  )
}
