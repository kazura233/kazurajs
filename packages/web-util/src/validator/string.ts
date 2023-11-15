/**
 * 判断字符串是否是 json 编码
 * @param str
 * @returns
 */
export function isJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 判断字符串是否是 base64 编码
 * @param str
 * @returns
 */
export const isBase64 = (str: string): boolean => {
  try {
    // 使用 atob 函数尝试解码字符串
    const decodedStr = atob(str)
    // 使用 btoa 函数再编码一次，并比较原始字符串和重新编码的字符串是否相等
    return btoa(decodedStr) === str
  } catch (error) {
    // 如果解码过程中出现错误，说明不是有效的 base64 编码
    return false
  }
}

const md5 = /^[a-f0-9]{32}$/

/**
 * 判断字符串是否是 MD5 编码
 * @param str
 * @returns
 */
export function isMD5(str: string): boolean {
  return md5.test(str)
}

/**
 * 检查给定字符串是否为小写字母形式。
 * @param str
 * @returns
 */
export function isLowercase(str: string): boolean {
  return str === str.toLowerCase()
}

/**
 * 检查给定字符串是否为大写字母形式。
 * @param str
 * @returns
 */
export function isUppercase(str: string): boolean {
  return str === str.toUpperCase()
}

/**
 * 哈希算法类型映射
 */
export const HashAlgorithmMap = {
  md5: 'md5',
  md4: 'md4',
  sha1: 'sha1',
  sha256: 'sha256',
  sha384: 'sha384',
  sha512: 'sha512',
  ripemd128: 'ripemd128',
  ripemd160: 'ripemd160',
  tiger128: 'tiger128',
  tiger160: 'tiger160',
  tiger192: 'tiger192',
  crc32: 'crc32',
  crc32b: 'crc32b',
} as const

const HashAlgorithmLengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8,
} as const

/**
 * 检查字符串是否为指定算法类型的哈希值。
 * 算法类型包括：['md5', 'md4', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128', 'tiger160', 'tiger192', 'crc32', 'crc32b']
 * @param str
 * @param algorithm
 * @returns
 */
export function isHash(str: string, algorithm: keyof typeof HashAlgorithmMap): boolean {
  const length = HashAlgorithmLengths[algorithm]
  const hash = new RegExp(`^[a-fA-F0-9]{${length}}$`)
  return hash.test(str)
}

const hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i

/**
 * 检查字符串是否为十六进制颜色值。
 * @param str
 * @returns
 */
export function isHexColor(str: string): boolean {
  return hexcolor.test(str)
}

/**
 * UUID版本映射
 */
export const UUIDVersionMap = {
  v1: 'v1',
  v2: 'v2',
  v3: 'v3',
  v4: 'v4',
  v5: 'v5',
  all: 'all',
} as const

const UUIDPatterns = {
  v1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  v2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  v3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  v4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  v5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
} as const

/**
 * 检查字符串是否为 UUID（版本 1、2、3、4 或 5）。
 * @param str
 * @param version
 * @returns
 */
export function isUUID(str: string, version: keyof typeof UUIDVersionMap = 'all'): boolean {
  const pattern = UUIDPatterns[version]
  return !!pattern && pattern.test(str)
}