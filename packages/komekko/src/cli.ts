#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { name, version, description } from '../package.json'
import { build } from './build'

const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  args: {
    dir: {
      type: 'positional',
      description: 'The directory to build',
      required: false,
    },
    minify: {
      type: 'boolean',
      description: 'Minify build',
    },
    sourcemap: {
      type: 'boolean',
      description: 'Generate sourcemaps',
    },
  },
  async run({ args }) {
    await build(args.dir, {
      sourcemap: args.sourcemap,
      minify: args.minify,
    }).catch((error) => {
      console.error(`Error building ${args.dir}: ${error}`)
      throw error
    })
  },
})

void runMain(main)
