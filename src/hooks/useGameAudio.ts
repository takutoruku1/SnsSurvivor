import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { useAudioStore } from '../store/audioStore'
import { assetPath } from '../utils/assetPath'
import type { GameStatus } from '../types'

interface TrackCfg {
  src: string
  loop: boolean
}

const TRACKS: Record<GameStatus, TrackCfg | null> = {
  title: { src: assetPath('audio/bgm_title.mp3'), loop: true },
  playing: { src: assetPath('audio/bgm_play.mp3'), loop: true },
  gameover: { src: assetPath('audio/bgm_gameover.mp3'), loop: false },
  clear: { src: assetPath('audio/bgm_clear.mp3'), loop: false },
}

export function useGameAudio() {
  const status = useGameStore((s) => s.status)
  const volume = useAudioStore((s) => s.volume)
  const muted = useAudioStore((s) => s.muted)
  const unlocked = useAudioStore((s) => s.unlocked)
  const setUnlocked = useAudioStore((s) => s.setUnlocked)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentSrcRef = useRef<string | null>(null)

  // Lazy-init audio element
  if (audioRef.current == null) {
    const el = new Audio()
    el.preload = 'auto'
    el.addEventListener('error', () => {
      // Silently ignore missing files — game continues
    })
    audioRef.current = el
  }

  // First user gesture unlocks audio playback
  useEffect(() => {
    if (unlocked) return
    const handler = () => {
      setUnlocked(true)
    }
    window.addEventListener('pointerdown', handler, { once: true })
    window.addEventListener('keydown', handler, { once: true })
    return () => {
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [unlocked, setUnlocked])

  // Sync volume/mute changes to the audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  // Switch track when game status changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!unlocked) return

    const cfg = TRACKS[status]
    if (!cfg) {
      audio.pause()
      currentSrcRef.current = null
      return
    }

    if (currentSrcRef.current === cfg.src && !audio.paused) {
      return
    }

    audio.src = cfg.src
    audio.loop = cfg.loop
    audio.currentTime = 0
    audio.volume = muted ? 0 : volume
    currentSrcRef.current = cfg.src
    void audio.play().catch(() => {
      // ignore — file may be missing or blocked
    })
  }, [status, unlocked, volume, muted])

  // Pause when tab is hidden, resume when visible
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handler = () => {
      if (document.hidden) {
        audio.pause()
      } else if (currentSrcRef.current && unlocked) {
        void audio.play().catch(() => {
          // ignore
        })
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [unlocked])

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current
    return () => {
      audio?.pause()
    }
  }, [])
}
