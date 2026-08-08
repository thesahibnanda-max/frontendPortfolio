import { motion } from 'motion/react'
import { ChatHistoryPanel } from './ChatHistoryPanel'
import { InlineAuthPrompt } from './InlineAuthPrompt'
import { useChatUiStore } from '@/store/chatUi'
import { useAuthStore } from '@/store/auth'
import { useGoToChat } from '@/hooks/useGoToChat'

const SIDEBAR_WIDTH = 280

/**
 * Desktop-only (md:+) persistent sidebar, open by default and collapsible via
 * NavBar's toggle. Always mounted, even for anonymous visitors -- shows chat
 * history for authenticated users, or an inline sign-in/sign-up prompt for
 * anonymous ones (chatting itself never requires signing in).
 */
export function ChatSidebar() {
  const isAuthed = useAuthStore((s) => s.token !== null)
  const sidebarOpen = useChatUiStore((s) => s.sidebarOpen)
  const goToChat = useGoToChat()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden shrink-0 overflow-hidden border-r border-border/80 md:block"
    >
      <div style={{ width: SIDEBAR_WIDTH }} className="h-full">
        {isAuthed ? (
          <ChatHistoryPanel onSelectChat={goToChat} onNewChat={() => goToChat(null)} />
        ) : (
          <InlineAuthPrompt />
        )}
      </div>
    </motion.aside>
  )
}
