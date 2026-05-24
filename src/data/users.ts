import type { PostUser } from '../types'
import { assetPath } from '../utils/assetPath'

// 主人公（プレイヤー操作）のSNSアカウント
export const ME: PostUser = {
  handle: '@me_yowayowa',
  avatar: assetPath('characters/menhera_normal.png'),
}

export const USERS: PostUser[] = [
  { handle: '@Oyasumi_zzz', avatar: assetPath('avatars/user01.png') },
  { handle: '@boku_ha_kami', avatar: assetPath('avatars/user02.png') },
  { handle: '@kawaii_yo_39', avatar: assetPath('avatars/user03.png') },
  { handle: '@inumimi_lover', avatar: assetPath('avatars/user04.png') },
  { handle: '@yappari_sabishii', avatar: assetPath('avatars/user05.png') },
  { handle: '@nemu_nemui_', avatar: assetPath('avatars/user06.png') },
  { handle: '@tsuki_ni_naku', avatar: assetPath('avatars/user07.png') },
  { handle: '@yumemi_chan', avatar: assetPath('avatars/user08.png') },
  { handle: '@dame_ningen', avatar: assetPath('avatars/user09.png') },
  { handle: '@hoshi_no_neko', avatar: assetPath('avatars/user10.png') },
  { handle: '@menhera_san', avatar: assetPath('avatars/user11.png') },
  { handle: '@sleepy_baby', avatar: assetPath('avatars/user12.png') },
]
