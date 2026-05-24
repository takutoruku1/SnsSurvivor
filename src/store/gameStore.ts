import { create } from 'zustand'
import type { Desires, FloatingText, GameStatus, Post } from '../types'
import { ME, USERS } from '../data/users'
import {
  MY_POSTS_APPROVAL,
  MY_POSTS_EXPRESSION,
  POST_BODIES,
} from '../data/posts'

// === Game tuning constants ===
const REAL_DURATION_MS = 180_000 // 3 minutes real time
const GAME_START_HOUR = 0
const GAME_END_HOUR = 6
const DECAY_PER_SECOND = 0.45 // each desire decays this much per second per param

const INITIAL_DESIRES: Desires = {
  approval: 65,
  expression: 60,
  belonging: 55,
}

const MAX_TIMELINE = 6
const NEW_POST_INTERVAL_MS = 4500

let postIdCounter = 1
let floatIdCounter = 1

function makePost(nowMs: number): Post {
  const user = USERS[Math.floor(Math.random() * USERS.length)]
  const body = POST_BODIES[Math.floor(Math.random() * POST_BODIES.length)]
  return {
    id: `p${postIdCounter++}`,
    user,
    body,
    likes: Math.floor(Math.random() * 90) + 5,
    comments: Math.floor(Math.random() * 15),
    createdAtMs: nowMs,
    liked: false,
    replied: false,
  }
}

function makeInitialTimeline(nowMs: number): Post[] {
  return Array.from({ length: MAX_TIMELINE }, (_, i) =>
    makePost(nowMs - i * 60_000),
  )
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

interface GameState {
  status: GameStatus
  desires: Desires
  elapsedMs: number
  timeline: Post[]
  floatingTexts: FloatingText[]
  lastTickMs: number
  msSinceNewPost: number

  // Actions
  startGame: () => void
  resetToTitle: () => void
  tick: (deltaMs: number) => void
  post: () => void
  like: (postId: string) => void
  reply: (postId: string) => void
  refreshTimeline: () => void
  removeFloatingText: (id: number) => void
}

function addFloat(
  state: GameState,
  text: string,
  color: string,
): FloatingText[] {
  const float: FloatingText = {
    id: floatIdCounter++,
    text,
    color,
    x: 30 + Math.random() * 40,
    y: 30 + Math.random() * 30,
  }
  return [...state.floatingTexts, float]
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'title',
  desires: { ...INITIAL_DESIRES },
  elapsedMs: 0,
  timeline: [],
  floatingTexts: [],
  lastTickMs: 0,
  msSinceNewPost: 0,

  startGame: () => {
    const now = Date.now()
    set({
      status: 'playing',
      desires: { ...INITIAL_DESIRES },
      elapsedMs: 0,
      timeline: makeInitialTimeline(now),
      floatingTexts: [],
      lastTickMs: now,
      msSinceNewPost: 0,
    })
  },

  resetToTitle: () => {
    set({
      status: 'title',
      desires: { ...INITIAL_DESIRES },
      elapsedMs: 0,
      timeline: [],
      floatingTexts: [],
    })
  },

  tick: (deltaMs: number) => {
    const s = get()
    if (s.status !== 'playing') return

    const seconds = deltaMs / 1000
    const decay = DECAY_PER_SECOND * seconds

    const next: Desires = {
      approval: clamp(s.desires.approval - decay),
      expression: clamp(s.desires.expression - decay),
      belonging: clamp(s.desires.belonging - decay),
    }

    const newElapsed = s.elapsedMs + deltaMs
    let newStatus: GameStatus = 'playing'
    if (
      next.approval <= 0 ||
      next.expression <= 0 ||
      next.belonging <= 0
    ) {
      newStatus = 'gameover'
    } else if (newElapsed >= REAL_DURATION_MS) {
      newStatus = 'clear'
    }

    // periodically add new posts
    let newTimeline = s.timeline
    let newMsSinceNewPost = s.msSinceNewPost + deltaMs
    if (newMsSinceNewPost >= NEW_POST_INTERVAL_MS && newStatus === 'playing') {
      newMsSinceNewPost = 0
      const fresh = makePost(Date.now())
      newTimeline = [fresh, ...s.timeline].slice(0, MAX_TIMELINE)
    }

    // Auto-increment likes/comments on the player's posts (simulate reactions arriving)
    const now = Date.now()
    let mutated = false
    const reactedTimeline = newTimeline.map((p) => {
      if (!p.isMine) return p
      const ageSec = (now - p.createdAtMs) / 1000
      if (ageSec > 25) return p // reactions taper off
      // probability scales with deltaMs and decays with age
      const ageFactor = Math.max(0.2, 1 - ageSec / 25)
      const likeProb = 0.9 * (deltaMs / 1000) * ageFactor
      const commentProb = 0.12 * (deltaMs / 1000) * ageFactor
      let likes = p.likes
      let comments = p.comments
      if (Math.random() < likeProb) {
        likes += 1
        mutated = true
      }
      if (Math.random() < commentProb) {
        comments += 1
        mutated = true
      }
      return likes === p.likes && comments === p.comments
        ? p
        : { ...p, likes, comments }
    })

    set({
      desires: next,
      elapsedMs: newElapsed,
      status: newStatus,
      timeline: mutated ? reactedTimeline : newTimeline,
      msSinceNewPost: newMsSinceNewPost,
    })
  },

  post: () => {
    const s = get()
    if (s.status !== 'playing') return
    // Random: boost either approval or expression strongly
    const focusApproval = Math.random() < 0.5
    const desires = { ...s.desires }
    const gain = 22
    if (focusApproval) {
      desires.approval = clamp(desires.approval + gain)
    } else {
      desires.expression = clamp(desires.expression + gain)
    }

    // Generate the body of "her" post depending on the desire being expressed
    const pool = focusApproval ? MY_POSTS_APPROVAL : MY_POSTS_EXPRESSION
    const body = pool[Math.floor(Math.random() * pool.length)]
    const myPost: Post = {
      id: `p${postIdCounter++}`,
      user: ME,
      body,
      likes: 0,
      comments: 0,
      createdAtMs: Date.now(),
      liked: false,
      replied: false,
      isMine: true,
    }

    set({
      desires,
      timeline: [myPost, ...s.timeline].slice(0, MAX_TIMELINE),
      floatingTexts: addFloat(
        s,
        focusApproval ? '+承認 ♡' : '+顕示 ☆',
        focusApproval ? '#ff4da6' : '#a855f7',
      ),
    })
  },

  like: (postId: string) => {
    const s = get()
    if (s.status !== 'playing') return
    const target = s.timeline.find((p) => p.id === postId)
    if (!target || target.liked) return
    const desires = { ...s.desires }
    desires.belonging = clamp(desires.belonging + 14)
    set({
      desires,
      timeline: s.timeline.map((p) =>
        p.id === postId ? { ...p, liked: true, likes: p.likes + 1 } : p,
      ),
      floatingTexts: addFloat(s, '+所属 ✦', '#38bdf8'),
    })
  },

  reply: (postId: string) => {
    const s = get()
    if (s.status !== 'playing') return
    const target = s.timeline.find((p) => p.id === postId)
    if (!target || target.replied) return
    // Reply boosts a random desire
    const keys: (keyof Desires)[] = ['approval', 'expression', 'belonging']
    const pick = keys[Math.floor(Math.random() * keys.length)]
    const desires = { ...s.desires }
    desires[pick] = clamp(desires[pick] + 10)
    const labelMap: Record<keyof Desires, [string, string]> = {
      approval: ['+承認', '#ff4da6'],
      expression: ['+顕示', '#a855f7'],
      belonging: ['+所属', '#38bdf8'],
    }
    const [text, color] = labelMap[pick]
    set({
      desires,
      timeline: s.timeline.map((p) =>
        p.id === postId ? { ...p, replied: true, comments: p.comments + 1 } : p,
      ),
      floatingTexts: addFloat(s, text + ' 💬', color),
    })
  },

  refreshTimeline: () => {
    const s = get()
    if (s.status !== 'playing') return
    const keys: (keyof Desires)[] = ['approval', 'expression', 'belonging']
    const pick = keys[Math.floor(Math.random() * keys.length)]
    const desires = { ...s.desires }
    desires[pick] = clamp(desires[pick] - 6)
    set({
      desires,
      timeline: makeInitialTimeline(Date.now()),
      msSinceNewPost: 0,
      floatingTexts: addFloat(s, '🔄 TL更新', '#a78bcf'),
    })
  },

  removeFloatingText: (id: number) => {
    set((s) => ({
      floatingTexts: s.floatingTexts.filter((f) => f.id !== id),
    }))
  },
}))

// === Selectors / helpers ===
export function getGameClock(elapsedMs: number): {
  hour: number
  minute: number
  display: string
  progress: number
} {
  const progress = Math.min(1, elapsedMs / REAL_DURATION_MS)
  const totalGameMinutes =
    progress * (GAME_END_HOUR - GAME_START_HOUR) * 60
  const hour = GAME_START_HOUR + Math.floor(totalGameMinutes / 60)
  const minute = Math.floor(totalGameMinutes % 60)
  const display = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  return { hour, minute, display, progress }
}

export function getEmotion(d: Desires): 'happy' | 'normal' | 'sad' {
  const avg = (d.approval + d.expression + d.belonging) / 3
  const min = Math.min(d.approval, d.expression, d.belonging)
  if (min < 25) return 'sad'
  if (avg > 70) return 'happy'
  return 'normal'
}

export const GAME_CONFIG = {
  REAL_DURATION_MS,
  GAME_START_HOUR,
  GAME_END_HOUR,
} as const
