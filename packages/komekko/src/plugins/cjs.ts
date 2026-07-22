import type { Plugin } from 'rollup'
import { FixDtsDefaultCjsExportsPlugin } from 'fix-dts-default-cjs-exports/rollup'
import debug from 'debug'

const log = {
  warn: debug('komekko:plugins:cjs:warn'),
} as const

export function fixCJSExportTypePlugin(): Plugin {
  const regexp = /\.d\.c?ts$/
  return FixDtsDefaultCjsExportsPlugin({
    warn: (msg) => log.warn(msg),
    matcher: (info) => {
      return (
        info.type === 'chunk' &&
        info.exports?.length > 0 &&
        info.exports.includes('default') &&
        regexp.test(info.fileName) &&
        info.isEntry
      )
    },
  })
}
