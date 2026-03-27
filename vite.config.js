import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss({
      theme: {
        extend: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#0ea5e9',
            light: '#f8fafc',
            dark: '#1e293b'
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
          boxShadow: {
            'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          }
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
