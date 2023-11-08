import path from 'node:path'
import fs from 'node:fs'
import type { PackageJson } from 'pkg-types'

export * from './git'
export * from './totp'

export interface LookupFileOptions {
  /**
   * 如果设置为 true，则表示只返回文件的完整路径，而不返回文件内容。如果未指定或设置为 false，则返回文件的内容。
   */
  pathOnly?: boolean
  /**
   * 查找文件时的根目录。只有当父目录与 rootDir 匹配或是根目录时，函数才会继续向上查找文件。
   */
  rootDir?: string
  /**
   * 用于检查文件是否符合特定条件。只有当文件满足这个条件时，函数才会返回结果。
   * @param file
   * @returns
   */
  predicate?: (file: string) => boolean
}

/**
 * 用于在文件系统中查找特定文件
 * @param dir 要在其中查找文件的起始目录。
 * @param formats 要查找的文件的数组。函数将遍历这些格式，直到找到匹配的文件为止。
 * @param options
 * @returns
 */
export function lookupFile(
  dir: string,
  formats: string[],
  options?: LookupFileOptions
): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format)
    // 检查该路径对应的文件是否存在，并且是否是一个文件而不是目录。
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const result = options?.pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8')
      if (!options?.predicate || options.predicate(result)) {
        return result
      }
    }
  }
  const parentDir = path.dirname(dir)
  // 如果在当前目录未找到匹配的文件，并且 dir 不是根目录，且（如果定义了）父目录与 rootDir 匹配，那么递归地在父目录中查找匹配的文件。
  if (parentDir !== dir && (!options?.rootDir || parentDir.startsWith(options?.rootDir))) {
    return lookupFile(parentDir, formats, options)
  }
}

export function getPkgJson(root: string): PackageJson {
  return JSON.parse(lookupFile(root, ['package.json']) || `{}`)
}

export function getPkgName(name: string) {
  return name?.startsWith('@') ? name.split('/')[1] : name
}
