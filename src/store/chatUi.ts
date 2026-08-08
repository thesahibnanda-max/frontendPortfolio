import { create } from 'zustand'

interface ChatUiState {
  activeChatId: string | null
  setActiveChatId: (id: string | null) => void
  /** Desktop persistent sidebar (md:+) — open by default. */
  sidebarOpen: boolean
  toggleSidebar: () => void
  /** Mobile overlay (below md:) — closed by default, opened via the same toggle button. */
  mobileHistoryOpen: boolean
  setMobileHistoryOpen: (open: boolean) => void
}

export const useChatUiStore = create<ChatUiState>((set) => ({
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  mobileHistoryOpen: false,
  setMobileHistoryOpen: (open) => set({ mobileHistoryOpen: open }),
}))
