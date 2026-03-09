import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { exifPlugin } from './vite-plugin-exif'

// https://vite.dev/config/
export default defineConfig({
  plugins: [exifPlugin(), react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // Stable vendor libraries in their own chunks so app-code changes
          // don't bust the cache for these large, infrequently updated deps.
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':   ['framer-motion'],
          'vendor-map':      ['leaflet', 'react-leaflet', 'react-leaflet-cluster'],
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
})
