import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export function useGameLoop() {
  const status = useGameStore((s) => s.status)
  const tick = useGameStore((s) => s.tick)
  const lastTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (status !== 'playing') {
      lastTimeRef.current = null
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    const loop = (now: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = now
      }
      const delta = now - lastTimeRef.current
      lastTimeRef.current = now
      if (delta > 0) {
        tick(delta)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTimeRef.current = null
    }
  }, [status, tick])
}
