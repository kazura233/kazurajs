import { resolve } from 'pathe'
import { RollupBuilder } from './builder/rollup'
import type { KomekkoOptions } from './types'
import defu from 'defu'
import type { PackageJson } from 'pkg-types'
import { createJiti } from 'jiti'
import debug from 'debug'

const log = {
  info: debug('komekko:build:info'),
  error: debug('komekko:build:error'),
} as const

export async function build(rootDir: string = './', inputConfig: KomekkoOptions = {}) {
  rootDir = resolve(process.cwd(), rootDir)
  log.info('>>>>>>>>>> build->rootDir: %s', rootDir)
  log.info('>>>>>>>>>> build->inputConfig: %O', inputConfig)

  const pkg: PackageJson =
    (await createJiti(rootDir).import('./package.json', {
      try: true,
      default: true,
    })) || {}

  const komekkoConfig: KomekkoOptions | KomekkoOptions[] =
    (await createJiti(rootDir, { interopDefault: true }).import('./komekko.config', {
      try: true,
      default: true,
    })) || {}

  const buildConfigs = (Array.isArray(komekkoConfig) ? komekkoConfig : [komekkoConfig]).filter(
    Boolean
  )
  log.info('>>>>>>>>>> build->buildConfigs: %O', buildConfigs)

  for (const buildConfig of buildConfigs) {
    const builder = new RollupBuilder(rootDir, pkg, defu(buildConfig, inputConfig))
    builder.autoPreset()
    await builder.build()
    log.info('>>>>>>>>>> Successfully built 🎉')
  }
}
