import jiti from 'jiti'
import { createHash } from 'node:crypto'

export function tryRequire(id: string, rootDir: string = process.cwd()) {
  const _require = jiti(rootDir, { interopDefault: true, esmResolve: true })
  try {
    return _require(id)
  } catch (error: any) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      console.error(`Error trying import ${id} from ${rootDir}`, error)
    }
    return {}
  }
}

export function getpkg(id = '') {
  const s = id.split('/')
  return s[0][0] === '@' ? `${s[0]}/${s[1]}` : s[0]
}

export function md5(text: string): string {
  return createHash('md5').update(text, 'utf8').digest('hex')
}

export function arrayIncludes(arr: (string | RegExp)[], searchElement: string) {
  return arr.some((entry) =>
    entry instanceof RegExp ? entry.test(searchElement) : entry === searchElement
  )
}

export function removeExtension(filename: string) {
  return filename.replace(/\.(d\.ts|js|mjs|cjs|ts|mts|cts|json|jsx|tsx)$/, '')
}
