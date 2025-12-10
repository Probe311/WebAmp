import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 10000,
    host: true
  },
  build: {
    // Optimisations pour temps de chargement < 1s
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'vendor-icons': ['lucide-react'],
          'audio': ['./src/audio/effects.ts', './src/audio/PedalboardEngine.ts']
        }
      }
    },
    // Code splitting agressif
    chunkSizeWarningLimit: 1000,
    // Minification optimisée
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})

