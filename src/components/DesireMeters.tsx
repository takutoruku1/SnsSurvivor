import { useGameStore } from '../store/gameStore'
import type { DesireKey } from '../types'

interface MeterCfg {
  key: DesireKey
  label: string
  icon: string
  subtitle: string
  color: string
  shadow: string
}

const METERS: MeterCfg[] = [
  {
    key: 'approval',
    label: '承認欲求',
    icon: '♥',
    subtitle: '誰かに認めてほしい…',
    color: 'from-pink-500 to-pink-400',
    shadow: 'shadow-[0_0_12px_rgba(255,77,166,0.5)]',
  },
  {
    key: 'expression',
    label: '自己顕示欲',
    icon: '✦',
    subtitle: 'もっと見てほしい…',
    color: 'from-purple-500 to-purple-400',
    shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
  },
  {
    key: 'belonging',
    label: '所属欲求',
    icon: '◆',
    subtitle: '仲間がほしい…',
    color: 'from-sky-500 to-sky-400',
    shadow: 'shadow-[0_0_12px_rgba(56,189,248,0.5)]',
  },
]

export function DesireMeters() {
  const desires = useGameStore((s) => s.desires)

  return (
    <div className="grid grid-cols-3 gap-3">
      {METERS.map((m) => {
        const value = desires[m.key]
        const isDanger = value < 25
        return (
          <div
            key={m.key}
            className={`rounded-xl p-3 bg-[var(--color-bg-card)]/80 border ${
              isDanger ? 'border-red-400 animate-pulse' : 'border-[var(--color-border-soft)]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold flex items-center gap-1">
                <span style={{ color: m.color.includes('pink') ? '#ff4da6' : m.color.includes('purple') ? '#a855f7' : '#38bdf8' }}>
                  {m.icon}
                </span>
                {m.label}
              </span>
              <span className="text-sm font-mono tabular-nums">
                {Math.round(value)}<span className="text-xs text-[var(--color-text-muted)]">/100</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-black/40 overflow-hidden mb-1">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${m.color} ${m.shadow} transition-[width] duration-200`}
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)]">
              {m.subtitle}
            </div>
          </div>
        )
      })}
    </div>
  )
}
