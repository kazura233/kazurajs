import jiti from 'jiti'

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
