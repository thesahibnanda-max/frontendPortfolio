import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AmbientRatingLine } from '@/components/chat/AmbientRatingLine'
import { MessageInput } from '@/components/chat/MessageInput'
import { MessageList } from '@/components/chat/MessageList'
import { StarterPrompts } from '@/components/chat/StarterPrompts'
import { AuthGateModal } from '@/components/chat/AuthGateModal'
import { ThreadHeader } from '@/components/chat/ThreadHeader'
import { ThreadSkeleton } from '@/components/chat/ThreadSkeleton'
import { useAuthStore } from '@/store/auth'
import { useChatUiStore } from '@/store/chatUi'
import { useChat, useCreateChat, useSendMessage } from '@/hooks/useChats'
import { ApiError } from '@/api/client'

function chatTitleFrom(message: string) {
  return message.length > 48 ? `${message.slice(0, 48)}…` : message
}

export function Landing() {
  const [input, setInput] = useState('')
  const pendingMessageRef = useRef<string | null>(null)

  const isAuthed = useAuthStore((s) => s.token !== null)
  const { activeChatId, setActiveChatId, openAuthGate } = useChatUiStore()

  const chatQuery = useChat(activeChatId)
  const createChat = useCreateChat()
  const sendMessage = useSendMessage()

  const isSending = createChat.isPending || sendMessage.isPending
  const messages = chatQuery.data?.messages ?? []
  const hasStarted = activeChatId !== null

  const doSend = async (message: string) => {
    try {
      let chatId = activeChatId
      if (!chatId) {
        const chat = await createChat.mutateAsync(chatTitleFrom(message))
        chatId = chat.chatId
        setActiveChatId(chatId)
      }
      await sendMessage.mutateAsync({ chatId, message })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.displayMessage : 'Failed to send message.')
    }
  }

  const handleSubmit = (message: string) => {
    const trimmed = message.trim()
    if (!trimmed) return
    setInput('')

    if (!isAuthed) {
      pendingMessageRef.current = trimmed
      openAuthGate()
      return
    }
    void doSend(trimmed)
  }

  const handleAuthenticated = () => {
    const pending = pendingMessageRef.current
    pendingMessageRef.current = null
    if (pending) void doSend(pending)
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

        <AuthGateModal onAuthenticated={handleAuthenticated} />
      </div>
    )
  }

  if (chatQuery.isLoading) {
    return <ThreadSkeleton />
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      {chatQuery.data && <ThreadHeader chat={chatQuery.data} onNewChat={startNewChat} />}
      <MessageList messages={messages} isSending={isSending} />
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
      <AuthGateModal onAuthenticated={handleAuthenticated} />
    </div>
  )
}
