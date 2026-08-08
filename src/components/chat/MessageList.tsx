import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import type { Message } from '@/api/types'

const NEAR_BOTTOM_THRESHOLD = 120

export function MessageList({
  messages,
  isSending,
}: {
  messages: Message[]
  isSending: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // Whether the user is at/near the bottom — auto-scroll only applies then,
  // so it never yanks their view away if they've scrolled up to reread.
  const stickToBottomRef = useRef(true)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
      stickToBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  // Re-scroll whenever the message stack's rendered height changes — this is
  // what actually catches the async markdown/Shiki content (ChatMarkdown's
  // MarkdownHooks) settling in taller than its initial fallback skeleton,
  // not just the message-count change below.
  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    const observer = new ResizeObserver(() => {
      if (stickToBottomRef.current) scrollToBottom('auto')
    })
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  // A new message (send starting, or a reply landing) always snaps to bottom.
  useEffect(() => {
    stickToBottomRef.current = true
    scrollToBottom()
  }, [messages.length, isSending])

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
      <div ref={contentRef} className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4">
        {messages.map((message, i) => (
          <MessageBubble key={i} message={message} />
        ))}
        {isSending && <TypingIndicator />}
      </div>
    </div>
  )
}
