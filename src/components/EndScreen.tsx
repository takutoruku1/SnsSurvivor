import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { assetPath } from '../utils/assetPath'

interface Props {
  variant: 'gameover' | 'clear'
}

const ENDING_IMG = {
  gameover: assetPath('characters/menhera_gameover.png'),
  clear: assetPath('characters/menhera_happy.png'),
}

const ENDING_EMOJI = {
  gameover: '💀',
  clear: '😊',
}

export function EndScreen({ variant }: Props) {
  const startGame = useGameStore((s) => s.startGame)
  const resetToTitle = useGameStore((s) => s.resetToTitle)
  const desires = useGameStore((s) => s.desires)
  const [imgFailed, setImgFailed] = useState(false)

  const isClear = variant === 'clear'

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center px-4 py-6 fade-in-up ${
        isClear
          ? 'bg-gradient-to-br from-orange-900/70 via-pink-900/70 to-purple-900/70'
          : 'bg-black/85'
      }`}
    >
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-center">
        {/* Character illustration */}
        <div className="relative aspect-[3/4] max-h-[70vh] mx-auto w-full max-w-md rounded-2xl overflow-hidden border-2 border-[var(--color-border-soft)] shadow-[0_0_40px_rgba(168,85,247,0.4)]">
          {imgFailed ? (
            <div className="w-full h-full flex items-center justify-center text-9xl opacity-50 bg-[var(--color-bg-card)]">
              {ENDING_EMOJI[variant]}
            </div>
          ) : (
            <img
              src={ENDING_IMG[variant]}
              alt={variant}
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          )}
          {/* glitch overlay for gameover */}
          {!isClear && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-red-900/30 via-transparent to-transparent mix-blend-overlay" />
          )}
        </div>

        {/* Right column: text + stats + buttons */}
        <div className="text-center lg:text-left">
          <h2
            className={`text-5xl md:text-6xl lg:text-7xl font-black mb-3 ${
              isClear
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 drop-shadow-[0_0_24px_rgba(255,200,100,0.5)]'
                : 'text-red-400 drop-shadow-[0_0_24px_rgba(255,0,80,0.7)]'
            }`}
          >
            {isClear ? '☀ 夜明け' : 'GAME OVER'}
          </h2>
          <p className="text-base md:text-xl text-[var(--color-text-main)] mb-2">
            {isClear
              ? '今夜も…生き延びたね…ありがとう'
              : 'ごめんね…もう無理だよぉ…'}
          </p>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)] mb-6">
            {isClear
              ? '新しい投稿との出会いが、次の夜を生き抜くカギに！'
              : 'どれかが0になっちゃった…'}
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 text-xs max-w-md mx-auto lg:mx-0">
            <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-2">
              <div className="text-pink-300 font-bold">♥ 承認</div>
              <div className="font-mono text-lg">
                {Math.round(desires.approval)}
              </div>
            </div>
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-2">
              <div className="text-purple-300 font-bold">✦ 顕示</div>
              <div className="font-mono text-lg">
                {Math.round(desires.expression)}
              </div>
            </div>
            <div className="bg-sky-500/10 border border-sky-400/30 rounded-lg p-2">
              <div className="text-sky-300 font-bold">◆ 所属</div>
              <div className="font-mono text-lg">
                {Math.round(desires.belonging)}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              ▶ もう一度
            </button>
            <button
              type="button"
              onClick={resetToTitle}
              className="px-6 py-3 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border-soft)] text-[var(--color-text-main)] font-bold hover:bg-[var(--color-bg-panel)] active:scale-95 transition cursor-pointer"
            >
              タイトルへ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
