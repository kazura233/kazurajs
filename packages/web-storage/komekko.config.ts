import { defineConfig } from 'komekko'

export default defineConfig([
  {},
  {
    outDir: './umd',
    entries: [
      {
        input: './src/index.ts',
        outFileName: 'web-storage.js',
        formats: ['umd'],
      },
    ],
    rollupOptions: {
      output: {
        name: 'WebStorage',
        globals: {},
      },
      external: [],
    },
  },
  {
    outDir: './umd',
    sourcemap: true,
    minify: true,
    entries: [
      {
        input: './src/index.ts',
        outFileName: 'web-storage.min.js',
        formats: ['umd'],
      },
    ],
    rollupOptions: {
      output: {
        name: 'WebStorage',
        globals: {},
      },
      external: [],
    },
  },
])
