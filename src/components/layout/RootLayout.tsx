import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatHistorySheet } from '@/components/chat/ChatHistorySheet'
import { useChatUiStore } from '@/store/chatUi'

export function RootLayout() {
  const mobileHistoryOpen = useChatUiStore((s) => s.mobileHistoryOpen)
  const setMobileHistoryOpen = useChatUiStore((s) => s.setMobileHistoryOpen)

  return (
    <div className="flex h-svh overflow-hidden">
      <ChatSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <NavBar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ChatHistorySheet open={mobileHistoryOpen} onOpenChange={setMobileHistoryOpen} />
    </div>
  )
}
