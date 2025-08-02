import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Geopolitics/', // must match your repo name
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        lore: 'lore.html',
      },
    },
  },
})
