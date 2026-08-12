import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ArchitectureType } from '@/api/types'

interface ArchitecturePreferenceState {
  architecture: ArchitectureType
  setArchitecture: (architecture: ArchitectureType) => void
}

export const useArchitecturePreferenceStore = create<ArchitecturePreferenceState>()(
  persist(
    (set) => ({
      architecture: 'orchestrator-worker',
      setArchitecture: (architecture) => set({ architecture }),
    }),
    { name: 'portfolio-architecture-preference' },
  ),
)
