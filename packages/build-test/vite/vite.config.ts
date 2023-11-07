import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: {
        'web-util': resolve(__dirname, './src/web-util.html'),
        'web-crypto': resolve(__dirname, './src/web-crypto.html'),
      },
    },
  },
})
