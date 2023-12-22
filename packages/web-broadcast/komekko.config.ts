import { type KomekkoOptions, defineConfig } from 'komekko'
import pkg from './package.json'

const fileName = pkg.name.split('/')[1]
const name = 'WebBroadcast'
const globals = {}

const getUMDOptions = (outFileName: string): KomekkoOptions => ({
  outDir: './umd',
  entries: [
    {
      input: './src/index.ts',
      outFileName,
      formats: ['umd'],
    },
  ],
  rollupOptions: {
    output: {
      name,
      globals,
    },
    external: [],
  },
})

const getIIFEOptions = (outFileName: string): KomekkoOptions => ({
  outDir: './iife',
  entries: [
    {
      input: './src/proxy-iife.ts',
      outFileName,
      formats: ['iife'],
    },
  ],
  rollupOptions: {
    external: [],
  },
})

export default defineConfig([
  {},
  getUMDOptions(fileName + '.js'),
  { ...getUMDOptions(fileName + '.min.js'), sourcemap: true, minify: true },
  getIIFEOptions(fileName + '.js'),
  { ...getIIFEOptions(fileName + '.min.js'), sourcemap: true, minify: true },
])
