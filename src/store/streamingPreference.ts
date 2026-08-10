import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StreamingPreferenceState {
  streamingEnabled: boolean
  setStreamingEnabled: (enabled: boolean) => void
  toggleStreaming: () => void
}

export const useStreamingPreferenceStore = create<StreamingPreferenceState>()(
  persist(
    (set) => ({
      streamingEnabled: true,
      setStreamingEnabled: (enabled) => set({ streamingEnabled: enabled }),
      toggleStreaming: () => set((s) => ({ streamingEnabled: !s.streamingEnabled })),
    }),
    { name: 'portfolio-streaming-preference' },
  ),
)
