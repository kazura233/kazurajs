import { type KomekkoOptions, defineConfig } from 'komekko'
import pkg from './package.json'

const fileName = pkg.name.split('/')[1]
const name = 'PostMsgBuilder'
const globals = {
  '@kazura/web-postmsg': 'WebPostMsg',
}

const getOptions = (outFileName: string): KomekkoOptions => ({
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
  getOptions(fileName + '.js'),
  { ...getOptions(fileName + '.min.js'), sourcemap: true, minify: true },
])
