import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { defineConfig } from 'rollup'

import pkg from './package.json' assert { type: 'json' }

const extensions = ['.ts']

const noDeclarationFiles = { compilerOptions: { declaration: false } }

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return (id) => pattern.test(id)
}

const inputFileNames = ['index', 'save-file']

const config = []

inputFileNames.forEach((inputFile) => {
  const filePath = inputFile !== 'index' ? `${inputFile}/index` : inputFile
  const input = `src/${filePath}.ts`

  config.push(
    // CommonJS
    defineConfig({
      input,
      output: {
        file: `lib/${filePath}.js`,
        format: 'cjs',
        indent: false,
        exports: 'named',
      },
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        json(),
        resolve({
          extensions,
        }),
        typescript({
          useTsconfigDeclarationDir: true,
          tsconfigOverride:
            filePath !== 'index'
              ? {
                  compilerOptions: { declarationDir: inputFile },
                  include: [`./src/${inputFile}/*.ts`],
                }
              : undefined,
        }),
        commonjs(),
      ],
    }),
    // ES
    defineConfig({
      input,
      output: {
        file: `es/${filePath}.js`,
        format: 'es',
        indent: false,
      },
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        json(),
        resolve({
          extensions,
        }),
        typescript({ tsconfigOverride: noDeclarationFiles }),
        commonjs(),
      ],
    })
  )
})

export default config
