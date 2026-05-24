import { useState } from 'react'
import { useAudioStore } from '../store/audioStore'

export function AudioControls() {
  const volume = useAudioStore((s) => s.volume)
  const muted = useAudioStore((s) => s.muted)
  const setVolume = useAudioStore((s) => s.setVolume)
  const toggleMute = useAudioStore((s) => s.toggleMute)
  const [expanded, setExpanded] = useState(false)

  const icon = muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'

  return (
    <div
      className="fixed top-3 right-3 z-40 flex items-center gap-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`overflow-hidden transition-all duration-200 ${
          expanded ? 'w-28 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-pink-400 cursor-pointer"
          aria-label="音量"
        />
      </div>
      <button
        type="button"
        onClick={toggleMute}
        className="w-10 h-10 rounded-full bg-[var(--color-bg-card)]/90 border border-[var(--color-border-soft)] backdrop-blur-sm hover:bg-[var(--color-bg-panel)] active:scale-95 transition flex items-center justify-center text-xl cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.3)]"
        aria-label={muted ? 'ミュート解除' : 'ミュート'}
        title={muted ? 'ミュート解除' : 'ミュート'}
      >
        {icon}
      </button>
    </div>
  )
}
