import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { defineConfig } from 'rollup'

import pkg from './package.json' assert { type: 'json' }

const extensions = ['.ts']

const noDeclarationFiles = { compilerOptions: { declaration: false } }

export default defineConfig([
  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      indent: false,
      exports: 'named',
    },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json(),
      resolve({
        extensions,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      commonjs(),
    ],
  },
  // ES
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'es',
      indent: false,
    },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json(),
      resolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      commonjs(),
    ],
  },
])
