import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { exifPlugin } from './vite-plugin-exif'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    exifPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Inject the service-worker registration script automatically
      injectRegister: 'auto',
      workbox: {
        // Pre-cache everything Vite emits (hashed JS/CSS/HTML).
        // On repeat visits these are served from Cache API — no network round-trip.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Raise the per-file size limit to cover the larger vendor chunks.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB
        runtimeCaching: [
          // Google Fonts stylesheets — stale-while-revalidate
          // (serve from cache immediately, refresh in background)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10 },
            },
          },
          // Google Fonts files — cache-first with 1-year TTL
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
          // CartoDB map tiles — stale-while-revalidate with a tile cap
          {
            urlPattern: /^https:\/\/[a-d]\.basemaps\.cartocdn\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'map-tiles',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
          // Local portfolio images live under public/ with stable URLs,
          // so prefer freshness over a long-lived cache hit on replaced files.
          {
            urlPattern: /\/assets\/img\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'portfolio-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Dulanga Jayawardena',
        short_name: 'Dulanga',
        description: 'Software engineer building scalable systems for financial markets.',
        theme_color: '#c41230',
        background_color: '#fafaf8',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
          },
        ],
      },
    }),
  ],
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
