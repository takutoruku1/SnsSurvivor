// Resolve a public/ asset path under the Vite base URL.
// dev: '/' + 'audio/bgm_play.mp3' = '/audio/bgm_play.mp3'
// build (GitHub Pages): '/SnsSurvivor/' + 'audio/bgm_play.mp3' = '/SnsSurvivor/audio/bgm_play.mp3'
export function assetPath(path: string): string {
  const base = import.meta.env.BASE_URL
  const trimmed = path.startsWith('/') ? path.slice(1) : path
  return base.endsWith('/') ? base + trimmed : base + '/' + trimmed
}
