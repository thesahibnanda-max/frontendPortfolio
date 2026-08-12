import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AmbientRatingLine } from '@/components/chat/AmbientRatingLine'
import { ArchitectureSelector } from '@/components/chat/ArchitectureSelector'
import { MessageInput } from '@/components/chat/MessageInput'
import { MessageList } from '@/components/chat/MessageList'
import { StarterPrompts } from '@/components/chat/StarterPrompts'
import { ThreadHeader } from '@/components/chat/ThreadHeader'
import { ThreadSkeleton } from '@/components/chat/ThreadSkeleton'
import { useChatUiStore } from '@/store/chatUi'
import { useChat, useCreateChat, useSendMessage } from '@/hooks/useChats'
import { useArchitecturePreferenceStore } from '@/store/architecturePreference'
import { useStreamingPreferenceStore } from '@/store/streamingPreference'
import { streamMessage } from '@/api/chats'
import { ApiError } from '@/api/client'
import type { ChatObject, Message } from '@/api/types'

function chatTitleFrom(message: string) {
  return message.length > 48 ? `${message.slice(0, 48)}…` : message
}

/**
 * An in-progress streamed send, scoped to the chat it belongs to. Keeping
 * `chatId` bundled with the text (rather than a bare `string | null`) is
 * what lets the UI tell "my active chat's stream" apart from "some other
 * chat's stream that's still running in the background" — see Important #3
 * in the final review: without this, switching chats mid-stream leaked the
 * old chat's partial text into whatever chat you navigated to.
 */
interface ActiveStream {
  chatId: string
  userText: string
  assistantText: string
}

/** A just-completed stream, scoped to the chat it belongs to, so a chat you've navigated away from can't force a resnap in the chat you're currently viewing. */
interface StreamCompletion {
  chatId: string
  token: number
}

export function Landing() {
  const [input, setInput] = useState('')
  const [activeStream, setActiveStream] = useState<ActiveStream | null>(null)
  const [streamCompletion, setStreamCompletion] = useState<StreamCompletion | null>(null)
  const streamCompletionTokenRef = useRef(0)

  const { activeChatId, setActiveChatId } = useChatUiStore()
  const { streamingEnabled } = useStreamingPreferenceStore()
  const { architecture } = useArchitecturePreferenceStore()
  const queryClient = useQueryClient()

  const chatQuery = useChat(activeChatId)
  const createChat = useCreateChat()
  const sendMessage = useSendMessage()

  const messages = chatQuery.data?.messages ?? []
  const hasStarted = activeChatId !== null

  // Only surface the stream in the UI if it belongs to the chat we're
  // currently looking at. The async work in doStreamingSend below keeps
  // running to completion (and still writes to the right chat's cache
  // entry via its own captured `chatId`) even when this is null because
  // the user navigated elsewhere.
  const streamingForActiveChat =
    activeStream !== null && activeStream.chatId === activeChatId ? activeStream : null

  // Signals MessageList to force a final resnap-to-bottom exactly when a
  // stream for the currently-viewed chat has just finished. `messages.length`
  // alone can't do this: the synthetic in-progress entries `displayMessages`
  // adds below occupy the same array slots the real persisted messages land
  // in at `done`, so the array length never changes across that swap and the
  // length-keyed resnap effect in MessageList would otherwise never re-fire
  // at the exact completion moment.
  const streamCompletedSignal =
    streamCompletion !== null && streamCompletion.chatId === activeChatId ? streamCompletion.token : undefined

  const isSending = createChat.isPending || sendMessage.isPending || streamingForActiveChat !== null

  // Show the typing indicator whenever something for THIS chat is in
  // flight and there's no reply content to show yet — once the first
  // streamed token arrives, `displayMessages` below already carries a
  // growing assistant bubble, so the indicator steps aside for it.
  const showTypingIndicator =
    isSending && (streamingForActiveChat === null || streamingForActiveChat.assistantText === '')

  // The real message list, plus — only while a stream for this exact chat
  // is in progress — two synthetic trailing entries occupying the SAME
  // array slots the real persisted messages will land in once `done`
  // fires. Keeping them in the same keyed positions (see MessageList's
  // `key={i}`) is what lets React reconcile the existing DOM node instead
  // of unmounting the streaming bubble and mounting a fresh one, which
  // used to cause the end-of-stream skeleton flash / re-animation.
  const displayMessages: Message[] = streamingForActiveChat
    ? [
        ...messages,
        { role: 'USER', message: streamingForActiveChat.userText, timestamp: new Date().toISOString() },
        ...(streamingForActiveChat.assistantText
          ? [
              {
                role: 'ASSISTANT',
                message: streamingForActiveChat.assistantText,
                timestamp: new Date().toISOString(),
              } satisfies Message,
            ]
          : []),
      ]
    : messages

  const doStreamingSend = async (chatId: string, message: string) => {
    setActiveStream({ chatId, userText: message, assistantText: '' })
    let buffer = ''
    let flushTimer: ReturnType<typeof setTimeout> | undefined
    const flush = () => {
      setActiveStream((prev) => (prev && prev.chatId === chatId ? { ...prev, assistantText: buffer } : prev))
      flushTimer = undefined
    }
    const clearFlushTimer = () => {
      if (flushTimer !== undefined) {
        clearTimeout(flushTimer)
        flushTimer = undefined
      }
    }
    // Clears this send's stream state, but only if it's still the one
    // showing — guards against a later/other doStreamingSend call (e.g.
    // the user started a new chat's stream in the meantime) having already
    // replaced it in `activeStream`.
    const clearOwnStream = () => {
      setActiveStream((prev) => (prev && prev.chatId === chatId ? null : prev))
    }
    let doneFired = false

    try {
      await streamMessage(chatId, message, architecture, {
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
            const lastMessage = prior.messages[prior.messages.length - 1]
            const alreadyMerged =
              lastMessage !== undefined &&
              lastMessage.role === 'ASSISTANT' &&
              lastMessage.message === finalMessage
            // Guards against a `['chats', chatId]` refetch landing between
            // the backend persisting both messages and this onDone firing
            // client-side, which would otherwise append a duplicate pair
            // here (self-heals on the next invalidateQueries refetch, but
            // this avoids the visible duplicate round-trip in the meantime).
            if (!alreadyMerged) {
              const userMsg: Message = { role: 'USER', message, timestamp: new Date().toISOString() }
              const assistantMsg: Message = { role: 'ASSISTANT', message: finalMessage, timestamp }
              queryClient.setQueryData(['chats', chatId], {
                ...prior,
                messages: [...prior.messages, userMsg, assistantMsg],
                updatedAt: timestamp,
              })
            }
          }
          queryClient.invalidateQueries({ queryKey: ['chats'] })
          clearOwnStream()
          streamCompletionTokenRef.current += 1
          setStreamCompletion({ chatId, token: streamCompletionTokenRef.current })
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
      clearOwnStream()
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
        await sendMessage.mutateAsync({ chatId, message, architecture })
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

          <ArchitectureSelector />

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
      <MessageList
        messages={displayMessages}
        isSending={showTypingIndicator}
        streamCompletedSignal={streamCompletedSignal}
      />
      <div className="shrink-0 border-t border-border/80 bg-background px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          <ArchitectureSelector compact />
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
