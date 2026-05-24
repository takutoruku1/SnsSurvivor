import { useState } from 'react'
import type { Post } from '../types'
import { useGameStore } from '../store/gameStore'

interface Props {
  post: Post
}

function elapsedLabel(createdAtMs: number): string {
  const sec = Math.max(0, Math.floor((Date.now() - createdAtMs) / 1000))
  if (sec < 5) return 'たった今'
  if (sec < 60) return `${sec}秒前`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}分前`
  return `${Math.floor(min / 60)}時間前`
}

export function PostCard({ post }: Props) {
  const like = useGameStore((s) => s.like)
  const reply = useGameStore((s) => s.reply)
  const [avatarFailed, setAvatarFailed] = useState(false)

  const containerClass = post.isMine
    ? 'fade-in-up bg-gradient-to-br from-pink-500/25 to-purple-500/15 border border-pink-400/60 rounded-lg p-3 text-left shadow-[0_0_16px_rgba(255,77,166,0.35)] relative'
    : 'fade-in-up bg-[var(--color-bg-panel)]/90 border border-[var(--color-border-soft)] rounded-lg p-3 text-left'

  return (
    <div className={containerClass}>
      {post.isMine && (
        <span className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold shadow-[0_0_8px_rgba(255,77,166,0.7)]">
          わたし
        </span>
      )}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0 overflow-hidden">
          {avatarFailed ? (
            <span>{post.user.handle.slice(1, 3)}</span>
          ) : (
            <img
              src={post.user.avatar}
              alt={post.user.handle}
              className="w-full h-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 justify-between">
            <span
              className={`text-xs font-bold truncate ${
                post.isMine ? 'text-pink-200' : 'text-[var(--color-text-main)]'
              }`}
            >
              {post.user.handle}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">
              {elapsedLabel(post.createdAtMs)}
            </span>
          </div>
          <div className="text-sm leading-snug mt-0.5 break-words">
            {post.body}
          </div>
          <div className="flex items-center gap-4 mt-2">
            {post.isMine ? (
              <>
                <span className="flex items-center gap-1 text-xs text-pink-300/80">
                  <span>♡</span>
                  <span>{post.likes}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)] ml-1">
                    {post.likes === 0 ? '…誰か…' : 'いいね届いた…'}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs text-sky-300/80">
                  <span>💭</span>
                  <span>{post.comments}</span>
                </span>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={post.liked}
                  onClick={() => like(post.id)}
                  className={`flex items-center gap-1 text-xs transition ${
                    post.liked
                      ? 'text-pink-400 cursor-default'
                      : 'text-[var(--color-text-muted)] hover:text-pink-400 cursor-pointer'
                  }`}
                >
                  <span>{post.liked ? '♥' : '♡'}</span>
                  <span>{post.likes}</span>
                </button>
                <button
                  type="button"
                  disabled={post.replied}
                  onClick={() => reply(post.id)}
                  className={`flex items-center gap-1 text-xs transition ${
                    post.replied
                      ? 'text-sky-400 cursor-default'
                      : 'text-[var(--color-text-muted)] hover:text-sky-400 cursor-pointer'
                  }`}
                >
                  <span>{post.replied ? '💬' : '💭'}</span>
                  <span>{post.comments}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
