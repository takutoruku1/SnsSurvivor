import { useGameStore } from '../store/gameStore'
import { PostCard } from './PostCard'

export function Timeline() {
  const timeline = useGameStore((s) => s.timeline)

  return (
    <div className="bg-[var(--color-bg-card)]/40 border border-[var(--color-border-soft)] rounded-xl p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-sm font-bold text-[var(--color-text-main)]">
          タイムライン
        </h2>
        <span className="text-[10px] text-[var(--color-text-muted)]">
          リアルタイムで流れてくる…
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto scrollbar-thin flex-1 pr-1">
        {timeline.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}
