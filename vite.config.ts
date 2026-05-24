import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pagesではリポジトリ名のサブパス配下になるので本番ビルドのみbaseを指定
  base: command === 'build' ? '/SnsSurvivor/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // OneDriveの同期中にmp3/png追加でクラッシュするのを防ぐ
      ignored: [
        '**/public/audio/**',
        '**/public/characters/**',
        '**/public/avatars/**',
        '**/.git/**',
      ],
    },
  },
}))
