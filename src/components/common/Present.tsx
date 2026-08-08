import type { ReactNode } from 'react'

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

/**
 * The backend omits absent optional fields entirely (non_null JSON policy)
 * rather than sending `null`. This renders children only when `value` is
 * actually present, so missing fields never show as "N/A" or empty rows.
 */
export function Present<T>({
  value,
  children,
}: {
  value: T | undefined | null
  children: (value: NonNullable<T>) => ReactNode
}) {
  if (isEmpty(value)) return null
  return <>{children(value as NonNullable<T>)}</>
}
