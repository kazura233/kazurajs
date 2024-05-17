import { type KomekkoOptions, defineConfig } from 'komekko'
import pkg from './package.json'

const fileName = pkg.name.split('/')[1]
const name = 'HttpClient'
const globals = {
  axios: 'axios',
}

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
  },
})

export default defineConfig([
  {},
  getUMDOptions(fileName + '.js'),
  { ...getUMDOptions(fileName + '.min.js'), sourcemap: true, minify: true },
])
