export type DesireKey = 'approval' | 'expression' | 'belonging'

export type Desires = Record<DesireKey, number>

export type GameStatus = 'title' | 'playing' | 'gameover' | 'clear'

export type EmotionState = 'happy' | 'normal' | 'sad' | 'gameover'

export interface PostUser {
  handle: string
  avatar: string
}

export interface Post {
  id: string
  user: PostUser
  body: string
  likes: number
  comments: number
  createdAtMs: number
  liked: boolean
  replied: boolean
  isMine?: boolean
}

export interface FloatingText {
  id: number
  text: string
  color: string
  x: number
  y: number
}
