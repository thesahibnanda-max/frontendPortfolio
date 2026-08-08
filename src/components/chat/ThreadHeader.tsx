import { useState, type KeyboardEvent } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRenameChat } from '@/hooks/useChats'
import { useAuthStore } from '@/store/auth'
import type { ChatObject } from '@/api/types'

export function ThreadHeader({ chat, onNewChat }: { chat: ChatObject; onNewChat: () => void }) {
  const isAuthed = useAuthStore((s) => s.token !== null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(chat.chatTitle)
  const renameChat = useRenameChat()

  const startEditing = () => {
    setDraft(chat.chatTitle)
    setEditing(true)
  }

  const commit = () => {
    setEditing(false)
    const title = draft.trim()
    if (title && title !== chat.chatTitle) {
      renameChat.mutate({ chatId: chat.chatId, chatTitle: title })
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      setEditing(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-background px-4 py-2.5">
      {editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="h-8 max-w-sm flex-1"
        />
      ) : isAuthed ? (
        <button
          onClick={startEditing}
          className="group flex min-w-0 flex-1 items-center gap-1.5 text-left text-sm font-medium"
        >
          <span className="truncate">{chat.chatTitle}</span>
          <Pencil className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      ) : (
        <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">
          {chat.chatTitle}
        </span>
      )}

      <Button variant="ghost" size="sm" onClick={onNewChat} className="shrink-0 gap-1.5">
        <Plus className="size-4" />
        New chat
      </Button>
    </div>
  )
}
