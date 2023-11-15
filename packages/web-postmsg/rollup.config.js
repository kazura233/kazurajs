import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'

import pkg from './package.json' assert { type: 'json' }

const extensions = ['.ts']

const noDeclarationFiles = { compilerOptions: { declaration: false } }

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(/^[^0-9]*/, '')

export default defineConfig([
  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      indent: false,
      exports: 'default',
    },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json(),
      resolve({
        extensions,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      // babel({
      //   extensions,
      //   plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }]],
      //   babelHelpers: 'runtime',
      // }),
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
      // babel({
      //   extensions,
      //   plugins: [
      //     ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion, useESModules: true }],
      //   ],
      //   babelHelpers: 'runtime',
      // }),
      commonjs(),
    ],
  },
  // UMD Development
  {
    input: 'src/index.ts',
    output: {
      file: pkg['umd:main'],
      format: 'umd',
      name: 'WebPostMsg',
      indent: false,
      exports: 'default',
      // globals: {},
    },
    // external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json(),
      resolve({ extensions }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }]],
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
      }),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        preventAssignment: true,
      }),
    ],
  },
  // UMD Production
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'WebPostMsg',
      indent: false,
      exports: 'default',
      // globals: {},
      sourcemap: true,
    },
    // external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json(),
      resolve({ extensions }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }]],
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
      }),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      terser(),
    ],
  },
])
