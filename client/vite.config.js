import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The React dev server proxies /api calls to the Express backend on :4000,
// so the frontend can just fetch("/api/...") with no CORS/port juggling.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
