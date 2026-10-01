import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { execSync } from 'node:child_process'
import { exifPlugin } from './vite-plugin-exif'

function buildSha() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim() || 'dev'
  } catch {
    return 'dev'
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [exifPlugin(), react(), tailwindcss()],
  base: '/',
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __BUILD_SHA__: JSON.stringify(buildSha()),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: isSsrBuild
      ? undefined
      : {
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
}))
