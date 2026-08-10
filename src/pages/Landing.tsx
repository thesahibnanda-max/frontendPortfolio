import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AmbientRatingLine } from '@/components/chat/AmbientRatingLine'
import { MessageInput } from '@/components/chat/MessageInput'
import { MessageList } from '@/components/chat/MessageList'
import { StarterPrompts } from '@/components/chat/StarterPrompts'
import { ThreadHeader } from '@/components/chat/ThreadHeader'
import { ThreadSkeleton } from '@/components/chat/ThreadSkeleton'
import { useChatUiStore } from '@/store/chatUi'
import { useChat, useCreateChat, useSendMessage } from '@/hooks/useChats'
import { useStreamingPreferenceStore } from '@/store/streamingPreference'
import { streamMessage } from '@/api/chats'
import { ApiError } from '@/api/client'
import type { ChatObject, Message } from '@/api/types'

function chatTitleFrom(message: string) {
  return message.length > 48 ? `${message.slice(0, 48)}…` : message
}

export function Landing() {
  const [input, setInput] = useState('')
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)

  const { activeChatId, setActiveChatId } = useChatUiStore()
  const { streamingEnabled } = useStreamingPreferenceStore()
  const queryClient = useQueryClient()

  const chatQuery = useChat(activeChatId)
  const createChat = useCreateChat()
  const sendMessage = useSendMessage()

  const isSending = createChat.isPending || sendMessage.isPending || streamingMessage !== null
  const messages = chatQuery.data?.messages ?? []
  const hasStarted = activeChatId !== null

  const doStreamingSend = async (chatId: string, message: string) => {
    setStreamingMessage('')
    let buffer = ''
    let flushTimer: ReturnType<typeof setTimeout> | undefined
    const flush = () => {
      setStreamingMessage(buffer)
      flushTimer = undefined
    }
    const clearFlushTimer = () => {
      if (flushTimer !== undefined) {
        clearTimeout(flushTimer)
        flushTimer = undefined
      }
    }
    let doneFired = false

    try {
      await streamMessage(chatId, message, {
        onToken: (content) => {
          buffer += content
          if (flushTimer === undefined) {
            flushTimer = setTimeout(flush, 75)
          }
        },
        onDone: (finalMessage, timestamp) => {
          doneFired = true
          clearFlushTimer()
          const prior = queryClient.getQueryData<ChatObject>(['chats', chatId])
          if (prior) {
            const userMsg: Message = { role: 'USER', message, timestamp: new Date().toISOString() }
            const assistantMsg: Message = { role: 'ASSISTANT', message: finalMessage, timestamp }
            queryClient.setQueryData(['chats', chatId], {
              ...prior,
              messages: [...prior.messages, userMsg, assistantMsg],
              updatedAt: timestamp,
            })
          }
          queryClient.invalidateQueries({ queryKey: ['chats'] })
          setStreamingMessage(null)
        },
      })
      if (!doneFired) {
        // streamMessage resolved without ever calling onDone (e.g. the
        // response had no readable body) — nothing was persisted server-side
        // in this case either, so surface it the same way a thrown error
        // would be, and resync from the server.
        throw new Error('Stream ended without a completion event.')
      }
    } catch (err) {
      clearFlushTimer()
      setStreamingMessage(null)
      toast.error(err instanceof ApiError ? err.displayMessage : 'Failed to stream message.')
      queryClient.invalidateQueries({ queryKey: ['chats', chatId] })
    }
  }

  const doSend = async (message: string) => {
    try {
      let chatId = activeChatId
      if (!chatId) {
        const chat = await createChat.mutateAsync(chatTitleFrom(message))
        chatId = chat.chatId
        setActiveChatId(chatId)
      }
      if (streamingEnabled) {
        await doStreamingSend(chatId, message)
      } else {
        await sendMessage.mutateAsync({ chatId, message })
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.displayMessage : 'Failed to send message.')
    }
  }

  const handleSubmit = (message: string) => {
    const trimmed = message.trim()
    if (!trimmed) return
    setInput('')
    void doSend(trimmed)
  }

  const startNewChat = () => {
    setActiveChatId(null)
    setInput('')
  }

  if (!hasStarted) {
    return (
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4">
        <AmbientRatingLine />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex w-full max-w-2xl flex-col items-center gap-8"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Ask me anything about Sahib.
            </h1>
            <p className="max-w-md text-muted-foreground">
              Competitive programmer, engineer, and an AI-queryable portfolio. Ask a
              question and I'll answer as him.
            </p>
          </div>

          <div className="w-full">
            <MessageInput
              value={input}
              onChange={setInput}
              onSubmit={() => handleSubmit(input)}
              disabled={isSending}
              large
              autoFocus
              autoFocusOnEnable
            />
          </div>

          <StarterPrompts onSelect={handleSubmit} />
        </motion.div>
      </div>
    )
  }

  if (chatQuery.isLoading) {
    return <ThreadSkeleton />
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      {chatQuery.data && <ThreadHeader chat={chatQuery.data} onNewChat={startNewChat} />}
      <MessageList messages={messages} isSending={isSending} streamingMessage={streamingMessage} />
      <div className="shrink-0 border-t border-border/80 bg-background px-4 py-3">
        <div className="mx-auto w-full max-w-3xl">
          <MessageInput
            value={input}
            onChange={setInput}
            onSubmit={() => handleSubmit(input)}
            disabled={isSending}
            placeholder="Ask a follow-up…"
            autoFocusOnEnable
          />
        </div>
      </div>
    </div>
  )
}
