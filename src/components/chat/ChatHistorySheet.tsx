import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ChatHistoryPanel } from './ChatHistoryPanel'
import { InlineAuthPrompt } from './InlineAuthPrompt'
import { useAuthStore } from '@/store/auth'
import { useGoToChat } from '@/hooks/useGoToChat'

/** Mobile-only overlay presentation of the chat history panel (below `md:`). */
export function ChatHistorySheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isAuthed = useAuthStore((s) => s.token !== null)
  const goToChat = useGoToChat()

  const selectChat = (chatId: string) => {
    goToChat(chatId)
    onOpenChange(false)
  }

  const startNewChat = () => {
    goToChat(null)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="font-heading">
            {isAuthed ? 'Your conversations' : 'Sign in to save chats'}
          </SheetTitle>
        </SheetHeader>
        {isAuthed ? (
          <ChatHistoryPanel onSelectChat={selectChat} onNewChat={startNewChat} />
        ) : (
          <InlineAuthPrompt />
        )}
      </SheetContent>
    </Sheet>
  )
}
