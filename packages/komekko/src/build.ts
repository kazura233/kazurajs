import { resolve } from 'pathe'
import { removeExtension, tryRequire } from './utils'
import { RollupBuilder } from './builder/rollup'
import { KomekkoOptions } from './types'

export async function build(rootDir: string, inputConfig: KomekkoOptions = {}) {
  rootDir = resolve(process.cwd(), rootDir || './')
  console.log('>>>>>>>>>>', 'build->rootDir', rootDir)
  console.log('>>>>>>>>>>', 'build->inputConfig', inputConfig)

  const komekkoConfig: KomekkoOptions | KomekkoOptions[] = tryRequire('./komekko.config', rootDir)
  const buildConfigs = (Array.isArray(komekkoConfig) ? komekkoConfig : [komekkoConfig]).filter(
    Boolean
  )
  console.log('>>>>>>>>>>', 'build->buildConfigs', buildConfigs)

  for (const buildConfig of buildConfigs) {
    const builder = new RollupBuilder(buildConfig)
    builder.autoPreset()
    builder.options.entries.forEach((entry) => {
      entry.entryFileName = removeExtension(entry.entryFileName)
      if (entry.entryFileName.startsWith('.') || entry.entryFileName.startsWith('/')) {
        throw new Error(
          `entryFileName must be a relative path, but received "${entry.entryFileName}"`
        )
      }
    })
    await builder.build()
    console.log('>>>>>>>>>>', 'Successfully built', '🎉')
  }
}
