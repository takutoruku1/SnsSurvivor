import { create } from 'zustand'

const LS_VOLUME = 'snssurvivor:volume'
const LS_MUTED = 'snssurvivor:muted'

function loadVolume(): number {
  try {
    const raw = localStorage.getItem(LS_VOLUME)
    if (raw == null) return 0.5
    const v = parseFloat(raw)
    if (Number.isNaN(v)) return 0.5
    return Math.max(0, Math.min(1, v))
  } catch {
    return 0.5
  }
}

function loadMuted(): boolean {
  try {
    return localStorage.getItem(LS_MUTED) === 'true'
  } catch {
    return false
  }
}

interface AudioState {
  volume: number
  muted: boolean
  unlocked: boolean

  setVolume: (v: number) => void
  toggleMute: () => void
  setUnlocked: (b: boolean) => void
}

export const useAudioStore = create<AudioState>((set) => ({
  volume: loadVolume(),
  muted: loadMuted(),
  unlocked: false,

  setVolume: (v) => {
    const clamped = Math.max(0, Math.min(1, v))
    try {
      localStorage.setItem(LS_VOLUME, String(clamped))
    } catch {
      // ignore storage failures
    }
    set({ volume: clamped })
  },

  toggleMute: () => {
    set((s) => {
      const muted = !s.muted
      try {
        localStorage.setItem(LS_MUTED, String(muted))
      } catch {
        // ignore
      }
      return { muted }
    })
  },

  setUnlocked: (b) => set({ unlocked: b }),
}))
