export * from './file'
export * from './image'
export * from './add-event-listener'
export * from './window-fission'
export * from './get-query-variable'
export * from './pattern'
export * from './create-uuid'
export * from './spawn-notification'
export * from './blink-title'
export * from './cors-enabled'
export * from './validator'
export * from './wx'
export * from './register-handle-drop'
export * from './register-handle-paste'

/**
 * 生成指定范围内的随机整数
 * @param min - 范围的最小值（包含）
 * @param max - 范围的最大值（包含）
 * @returns - 生成的随机整数
 */
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 延缓执行
 * @param duration - 暂停的毫秒数，默认为 1000 毫秒
 * @returns - 一个 Promise，在指定的时间后 resolve
 */
export const sleep = (duration: number = 1000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

/**
 * 向页面中动态追加脚本
 * @param url - 脚本的 URL
 * @param async - 是否异步加载，默认为 false
 * @param defer - 是否延迟加载，默认为 false
 */
export const appendScript = (url: string, async = false, defer = false) => {
  const script = document.createElement('script')
  script.src = url
  if (async) script.async = async
  if (defer) script.defer = defer

  document.body.appendChild(script)
}

/**
 * 在光标处插入，自动补正光标的偏移量
 * @param textarea - 要插入文本的 textarea 元素
 * @param text - 要插入的文本
 */
export const insertAtTextarea = (textarea: HTMLTextAreaElement, text: string) => {
  const { selectionStart, selectionEnd, value } = textarea

  const leftText = value.substring(0, selectionStart)
  const rightText = value.substring(selectionEnd)

  // 更新 textarea 的值
  textarea.value = leftText + text + rightText

  // 使 textarea 获得焦点
  textarea.focus()

  // 计算新的光标位置
  const newPosition = leftText.length + text.length

  // 设置新的光标位置
  textarea.setSelectionRange(newPosition, newPosition)
}

/**
 * 执行一个函数，并通过 Promise 包装其结果返回
 * 如果 fn 不是一个函数，而是一个 Promise，则原样返回，否则通过 Promise 包装后返回
 * @param fn - 要执行的函数或 Promise
 * @returns - 通过 Promise 包装的结果
 */
export function runFn<T>(fn: Promise<T> | ((...args: any[]) => T)): Promise<T> {
  return Promise.resolve(typeof fn === 'function' ? fn() : fn)
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
export const SpaceType = {
  /**
   * 使用全角空格的 Unicode 字符，Unicode 编码通常为 U+3000
   */
  FullWidthSpace: '　',
  /**
   * 使用半角空格的 Unicode 字符，Unicode 编码通常为 U+0020
   */
  HalfWidthSpace: ' ',
} as const

/**
 * 获取文件扩展名
 * @param file - 要获取扩展名的文件对象或文件名
 * @returns - 文件的扩展名（不包括点号）
 */
export const getFileExtension = (file: File | string): string => {
  const filename = file instanceof File ? file.name : file
  const dotIndex = filename.lastIndexOf('.')

  if (dotIndex !== -1) {
    return filename.slice(dotIndex + 1)
  } else {
    return ''
  }
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
