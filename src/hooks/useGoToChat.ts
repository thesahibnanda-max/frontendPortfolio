import { useNavigate, useLocation } from 'react-router-dom'
import { useChatUiStore } from '@/store/chatUi'

/**
 * Selecting a chat (or starting a new one) from the sidebar/history sheet
 * only updates state — if the visitor is browsing another page (e.g.
 * /about), that's invisible until they navigate to "/" themselves. This
 * wraps the state update with a navigate-if-needed so both New chat and
 * any old chat always land you looking at the conversation, from anywhere.
 */
export function useGoToChat() {
  const navigate = useNavigate()
  const location = useLocation()
  const setActiveChatId = useChatUiStore((s) => s.setActiveChatId)

  return (chatId: string | null) => {
    setActiveChatId(chatId)
    if (location.pathname !== '/') navigate('/')
  }
}
