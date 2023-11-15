export * from './file'
export * from './image'
export * from './register-event'
export * from './window-fission'
export * from './get-query-variable'
export * from './pattern'
export * from './create-uuid'
export * from './spawn-notification'
export * from './blink-title'
export * from './cors-enabled'
export * from './validator'
export * from './wx'

/**
 * 随机一个min到max之间的整数
 * @param min
 * @param max
 * @returns
 */
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 延缓执行
 * @param duration 暂停的毫秒数
 * @returns
 */
export const sleep = (duration: number = 1000): Promise<undefined> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

/**
 * 向页面中动态追加脚本
 * @param url
 */
export const appendScript = (url: string) => {
  const element = document.createElement('script')
  element.src = url
  document.body.appendChild(element)
}

/**
 * 在光标处插入，自动补正光标的偏移量
 * @param textarea
 * @param text
 */
export const insertAtTextarea = (textarea: HTMLTextAreaElement, text: string) => {
  const leftText = textarea.value.substring(0, textarea.selectionStart)
  const rightText = textarea.value.substring(textarea.selectionEnd)
  textarea.value = leftText + text + rightText
  textarea.focus()
  const v = leftText.length + text.length
  textarea.setSelectionRange(v, v)
}

/**
 * 执行一个函数，并把其结果通过promise包装的方式返回
 * 如果fn不是一个函数，是一个promise会原样返回，否则会通过promise包装后返回
 * @param fn
 */
export function runFn<T>(fn: Promise<T> | ((...args: any[]) => T)): Promise<T> {
  let res = typeof fn === 'function' ? fn() : fn
  if (res instanceof Promise) {
    return res
  } else {
    return new Promise((_) => _(res))
  }
}

/**
 * 复制到剪贴板
 * @param text
 * @returns
 */
export { default as copy } from 'copy-to-clipboard'

/**
 * 空格类型
 */
export class SpaceType {
  /**
   * 使用全角空格的 Unicode 字符，Unicode 编码通常为 U+3000
   */
  public static readonly FullWidthSpace = '　'
  /**
   * 使用半角空格的 Unicode 字符，Unicode 编码通常为 U+0020
   */
  public static readonly HalfWidthSpace = ' '
}

/**
 * 获取文件扩展名
 * @param file
 * @returns
 */
export const getFileExtension = (file: File | string): string => {
  const filename = file instanceof File ? file.name : file
  return filename.split('.').pop() || ''
}

/**
 * 此函数返回在 Node 和浏览器中通用的全局对象。
 * 注意：globalThis 是标准化的方法，然而它在 Node.js 的版本 12 中才被添加。
 * 我们需要包含这个片段，直到 Node 12 到达生命周期结束（EOL）。
 * @returns
 */
export function getGlobal(): (Window & typeof globalThis) | undefined {
  if (typeof globalThis !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Type 'typeof globalThis' is not assignable to type 'Window & typeof globalThis'.
    return globalThis
  }

  if (typeof global !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Type 'typeof globalThis' is not assignable to type 'Window & typeof globalThis'.
    return global
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'window'.
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Cannot find name 'window'.
    return window
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'self'.
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Cannot find name 'self'.
    return self
  }
}
