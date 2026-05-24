import { useGameStore } from '../store/gameStore'

export function TitleScreen() {
  const startGame = useGameStore((s) => s.startGame)

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-[0_0_24px_rgba(255,77,166,0.6)]">
        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
          SNS×サバイバー
        </span>
      </h1>
      <p className="text-base md:text-lg text-[var(--color-text-muted)] mb-2">
        あなたの「いいね」が、彼女の明日をつなぐ。
      </p>
      <p className="text-xs md:text-sm text-[var(--color-text-muted)] mb-10 max-w-md leading-relaxed">
        深夜0時から朝6時まで、3分間のサバイバル。<br />
        承認欲求・自己顕示欲・所属欲求の3つを切らさないように、<br />
        投稿・いいね・リプ・TL更新で彼女を生き延びさせよう。
      </p>

      <button
        type="button"
        onClick={startGame}
        className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow-[0_0_24px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition cursor-pointer"
      >
        ▶ 今夜を始める
      </button>

      <div className="mt-10 grid grid-cols-3 gap-3 max-w-md text-xs text-[var(--color-text-muted)]">
        <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-2">
          <div className="text-pink-300 font-bold mb-1">♥ 承認欲求</div>
          投稿・リプで回復
        </div>
        <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-2">
          <div className="text-purple-300 font-bold mb-1">✦ 自己顕示欲</div>
          投稿・リプで回復
        </div>
        <div className="bg-sky-500/10 border border-sky-400/30 rounded-lg p-2">
          <div className="text-sky-300 font-bold mb-1">◆ 所属欲求</div>
          いいねで回復
        </div>
      </div>
    </div>
  )
}
