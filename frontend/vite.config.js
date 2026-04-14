import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/baking/',
  build: {
    outDir: 'dist/baking'
  },
  plugins: [react()],
})
