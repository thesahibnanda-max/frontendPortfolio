import { useState, type KeyboardEvent } from 'react'
import { Search, MessageSquare, Plus, Pencil, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useChats, useSearchChats, useRenameChat, useChat } from '@/hooks/useChats'
import { useChatUiStore } from '@/store/chatUi'
import { cn } from '@/lib/utils'
import type { ChatObject } from '@/api/types'

function formatChatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

/**
 * New chat / search / chat list with inline rename. Presentational —
 * shared by the desktop persistent ChatSidebar and the mobile
 * ChatHistorySheet overlay so the data/rename logic lives in one place.
 */
export function ChatHistoryPanel({
  onSelectChat,
  onNewChat,
}: {
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
}) {
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const { data: chats, isLoading } = useChats()
  const search = useSearchChats()
  const renameChat = useRenameChat()
  const activeChatId = useChatUiStore((s) => s.activeChatId)
  // Dedupes against the same TanStack Query cache entry Landing.tsx reads —
  // no extra request, just lets this row show a spinner while it loads.
  const activeChatQuery = useChat(activeChatId)

  const results: ChatObject[] = query.trim() ? (search.data?.chats ?? []) : (chats ?? [])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim()) search.mutate(value.trim())
  }

  const startEditing = (chat: ChatObject) => {
    setEditingId(chat.chatId)
    setDraftTitle(chat.chatTitle)
  }

  const commitEdit = () => {
    if (!editingId) return
    const chatId = editingId
    const title = draftTitle.trim()
    setEditingId(null)
    if (title) renameChat.mutate({ chatId, chatTitle: title })
  }

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitEdit()
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2 p-3">
        <Button variant="outline" className="justify-start gap-2" onClick={onNewChat}>
          <Plus className="size-4" />
          New chat
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search chats"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-4">
        {isLoading && <p className="px-2 py-4 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && results.length === 0 && (
          <p className="px-2 py-4 text-sm text-muted-foreground">
            {query.trim() ? 'No chats match that search.' : 'No conversations yet.'}
          </p>
        )}
        {results.map((chat) =>
          editingId === chat.chatId ? (
            <div key={chat.chatId} className="flex items-center gap-2 px-2.5 py-1.5">
              <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
              <Input
                autoFocus
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={commitEdit}
                className="h-7 flex-1 px-1.5 text-sm"
              />
            </div>
          ) : (
            <div
              key={chat.chatId}
              className={cn(
                'group flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm transition-colors hover:bg-secondary',
                activeChatId === chat.chatId && 'bg-secondary',
              )}
            >
              <button
                onClick={() => onSelectChat(chat.chatId)}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
              >
                {activeChatId === chat.chatId && activeChatQuery.isLoading ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 flex-1 truncate">{chat.chatTitle}</span>
              </button>
              <button
                onClick={() => startEditing(chat)}
                aria-label="Rename chat"
                className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
              >
                <Pencil className="size-3.5" />
              </button>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatChatTimestamp(chat.updatedAt)}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
