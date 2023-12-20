import { resolve } from 'pathe'
import { tryRequire } from './utils'
import { RollupBuilder } from './builder/rollup'
import type { KomekkoOptions } from './types'
import defu from 'defu'
import type { PackageJson } from 'pkg-types'

export async function build(rootDir: string = './', inputConfig: KomekkoOptions = {}) {
  rootDir = resolve(process.cwd(), rootDir)
  console.log('>>>>>>>>>>', 'build->rootDir', rootDir)
  console.log('>>>>>>>>>>', 'build->inputConfig', inputConfig)

  const pkg: PackageJson = tryRequire('./package.json', rootDir)

  const komekkoConfig: KomekkoOptions | KomekkoOptions[] = tryRequire('./komekko.config', rootDir)
  const buildConfigs = (Array.isArray(komekkoConfig) ? komekkoConfig : [komekkoConfig]).filter(
    Boolean
  )
  console.log('>>>>>>>>>>', 'build->buildConfigs', buildConfigs)

  for (const buildConfig of buildConfigs) {
    const builder = new RollupBuilder(rootDir, pkg, defu(inputConfig, buildConfig))
    builder.autoPreset()
    await builder.build()
    console.log('>>>>>>>>>>', 'Successfully built', '🎉')
  }
}
