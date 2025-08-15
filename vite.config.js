import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import { VueMcp } from 'vite-plugin-vue-mcp'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages(),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default',
    }),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    VueMcp(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      primeicons: fileURLToPath(
        new URL('./node_modules/primeicons', import.meta.url),
      ),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 你的後端伺服器位址
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          primevue: ['primevue'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'primevue', 'chart.js'],
  },
})
