import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        rewrite(path) {
          return path.replace(/^\/api/, '');
        },
        target: 'http://localhost:8081',
      }
    }
  }
})
