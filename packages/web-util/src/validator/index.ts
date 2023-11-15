export * from './typed-is-promise'
export * from './typechecker'

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
