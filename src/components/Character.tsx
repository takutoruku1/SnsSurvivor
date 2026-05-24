import { useEffect, useState } from 'react'
import { useGameStore, getEmotion } from '../store/gameStore'

const EMOTION_IMG: Record<'happy' | 'normal' | 'sad' | 'gameover', string> = {
  happy: '/characters/menhera_happy.png',
  normal: '/characters/menhera_normal.png',
  sad: '/characters/menhera_sad.png',
  gameover: '/characters/menhera_gameover.png',
}

const EMOTION_EMOJI: Record<'happy' | 'normal' | 'sad' | 'gameover', string> = {
  happy: '😊',
  normal: '😐',
  sad: '😢',
  gameover: '💀',
}

const EMOTION_QUOTE: Record<'happy' | 'normal' | 'sad', string[]> = {
  happy: [
    'いいねありがとう…！うれしいよぉ…',
    'みんな見ててくれてうれしい！',
    '今夜は…ちょっとだけ生きていけそう',
  ],
  normal: [
    'ねえ…誰か見つけてよ…',
    'このままだと…消えちゃうよ…？',
    '誰か起きてる…？',
  ],
  sad: [
    'もうダメかも…ひとりはやだよ…',
    'さみしくて死んじゃう…',
    'お願い…見て、わたしを…',
  ],
}

export function Character() {
  const desires = useGameStore((s) => s.desires)
  const status = useGameStore((s) => s.status)
  const elapsedMs = useGameStore((s) => s.elapsedMs)
  const floatingTexts = useGameStore((s) => s.floatingTexts)
  const removeFloatingText = useGameStore((s) => s.removeFloatingText)

  const [imgFailed, setImgFailed] = useState<
    Record<'happy' | 'normal' | 'sad' | 'gameover', boolean>
  >({ happy: false, normal: false, sad: false, gameover: false })

  const emotion = status === 'gameover' ? 'gameover' : getEmotion(desires)

  const quoteEmotion = emotion === 'gameover' ? 'sad' : emotion
  const quotes = EMOTION_QUOTE[quoteEmotion]
  const quoteIndex = Math.floor(elapsedMs / 8000) % quotes.length
  const quote = quotes[quoteIndex]

  useEffect(() => {
    if (floatingTexts.length === 0) return
    const timers = floatingTexts.map((f) =>
      setTimeout(() => removeFloatingText(f.id), 900),
    )
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [floatingTexts, removeFloatingText])

  const showFallback = imgFailed[emotion]

  return (
    <div className="relative h-full w-full bg-[var(--color-bg-card)]/40 border border-[var(--color-border-soft)] rounded-xl overflow-hidden flex flex-col items-center justify-center">
      {showFallback ? (
        <div className="flex items-center justify-center text-8xl opacity-50">
          {EMOTION_EMOJI[emotion]}
        </div>
      ) : (
        <img
          src={EMOTION_IMG[emotion]}
          alt={`character-${emotion}`}
          className="w-full h-full object-cover"
          onError={() => setImgFailed((s) => ({ ...s, [emotion]: true }))}
        />
      )}

      {/* Speech bubble */}
      {status === 'playing' && (
        <div className="absolute top-3 right-3 max-w-[70%]">
          <div className="bg-pink-500/20 border border-pink-400/60 rounded-2xl px-3 py-2 text-xs leading-snug backdrop-blur-sm">
            {quote}
          </div>
        </div>
      )}

      {/* Floating gain texts */}
      {floatingTexts.map((f) => (
        <div
          key={f.id}
          className="absolute font-bold text-lg pointer-events-none drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            color: f.color,
            animation: 'fade-in-up 0.9s ease-out forwards',
          }}
        >
          {f.text}
        </div>
      ))}
    </div>
  )
}
