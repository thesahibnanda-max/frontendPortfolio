import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled,
  large,
  placeholder = 'Ask me anything about Sahib…',
  autoFocus,
  autoFocusOnEnable,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  large?: boolean
  placeholder?: string
  /** Focus on mount (the empty-state hero input). */
  autoFocus?: boolean
  /** Refocus once `disabled` flips back to false — restores the cursor after a send completes. */
  autoFocusOnEnable?: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocusOnEnable && !disabled) textareaRef.current?.focus()
  }, [disabled, autoFocusOnEnable])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) onSubmit()
    }
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-signal/40',
        large && 'p-3',
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={large ? 2 : 1}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          'max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground',
          large && 'text-base',
        )}
      />
      <Button
        size="icon"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="shrink-0 rounded-xl"
      >
        <ArrowUp className="size-4" />
      </Button>
    </div>
  )
}
