import { useGameStore, getGameClock } from '../store/gameStore'

export function TimeBar() {
  const elapsedMs = useGameStore((s) => s.elapsedMs)
  const { display, progress } = getGameClock(elapsedMs)

  return (
    <div className="w-full">
      <div className="text-center text-xs text-[var(--color-text-muted)] tracking-widest mb-1">
        生存タイムリミット
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--color-text-muted)]">深夜 00:00</span>
        <div className="flex-1 relative h-7 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border-soft)] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold tracking-wider text-white drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]">
            {display}
          </div>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">朝 06:00</span>
      </div>
    </div>
  )
}
