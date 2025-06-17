import DOMPurify, { type Config } from 'dompurify'

export type { Config } from 'dompurify'

/**
 * 将字符串中的特殊字符进行转义，以防止 XSS 攻击。
 * @param dirty  需要转义的字符串
 * @param cfg  DOMPurify 配置对象
 * @returns 转义后的字符串
 */
export function filterXSS(dirty: string, cfg?: Config): string {
  return DOMPurify.sanitize(dirty, cfg)
}
