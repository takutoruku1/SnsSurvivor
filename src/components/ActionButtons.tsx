import { useGameStore } from '../store/gameStore'

interface BtnCfg {
  key: string
  label: string
  desc: string
  icon: string
  onClick: () => void
  color: string
}

export function ActionButtons() {
  const post = useGameStore((s) => s.post)
  const refreshTimeline = useGameStore((s) => s.refreshTimeline)

  const buttons: BtnCfg[] = [
    {
      key: 'post',
      label: '投稿する',
      desc: 'タイムラインにつぶやく',
      icon: '✏️',
      onClick: post,
      color: 'from-pink-500/30 to-pink-500/10 border-pink-400/50 hover:border-pink-400',
    },
    {
      key: 'refresh',
      label: 'TL更新',
      desc: '欲求-6 / 投稿入替',
      icon: '🔄',
      onClick: refreshTimeline,
      color: 'from-purple-500/30 to-purple-500/10 border-purple-400/50 hover:border-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {buttons.map((b) => (
        <button
          key={b.key}
          type="button"
          onClick={b.onClick}
          className={`bg-gradient-to-br ${b.color} border rounded-xl p-3 text-left transition active:scale-95 cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{b.icon}</span>
            <div>
              <div className="font-bold text-sm">{b.label}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">
                {b.desc}
              </div>
            </div>
          </div>
        </button>
      ))}
      <div className="col-span-2 text-[10px] text-[var(--color-text-muted)] text-center">
        ♡ <span className="text-pink-300">いいね</span>・💭 <span className="text-sky-300">リプ</span> は左のタイムラインから投稿に直接タップ
      </div>
    </div>
  )
}
