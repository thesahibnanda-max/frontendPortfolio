import { motion } from 'motion/react'
import { ChatMarkdown } from './ChatMarkdown'
import { MessageTouchpoints } from './MessageTouchpoints'
import type { Message } from '@/api/types'
import { cn } from '@/lib/utils'

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'USER'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('flex max-w-[85%] flex-col gap-2 sm:max-w-[75%]', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-card text-card-foreground',
          )}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          ) : (
            <ChatMarkdown content={message.message} />
          )}
        </div>
        {!isUser && <MessageTouchpoints text={message.message} />}
      </div>
    </motion.div>
  )
}
