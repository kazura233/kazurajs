import { isNumber } from '@kazura/validator'

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
export * from './wx'
export * from './register-handle-drop'
export * from './register-handle-paste'
export * from './env'
export * from './audio-player'
export * from './aspect'
export * from './class-util'
export * from './network'

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'globalThis'.
  if (typeof globalThis !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Type 'typeof globalThis' is not assignable to type 'Window & typeof globalThis'.
    return globalThis
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'global'.
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
/**
 * 返回数组去重后的新数组
 * @param arr - 输入数组
 * @returns 去重后的数组
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * 将微任务加入队列以在控制返回浏览器的事件循环之前的安全时间执行。
 * @param callback - 要执行的函数
 */
export const queueMicrotask: (callback: VoidFunction) => void =
  window.queueMicrotask ||
  function (callback: VoidFunction) {
    Promise.resolve().then(callback)
  }

/**
 * 使用浏览器的语音合成 API 朗读文本。
 * @param text - 要朗读的文本
 * @param lang - 语言代码（例如 'en-US'、'zh-CN'）
 */
export function speak(text: string, lang: string): void {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel()
  }

  const speechInstance = new SpeechSynthesisUtterance(text)
  speechInstance.lang = lang
  speechSynthesis.speak(speechInstance)
}

/**
 * 断言条件为真，若条件为假则抛出错误。
 * @param condition - 判断条件
 * @param msg - 条件不满足时抛出的错误信息
 */
export function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg)
  }
}

/**
 * 包含 Promise 及其解析和拒绝函数的接口。
 */
export interface PromiseWithResolvers<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

/**
 * 创建带有解析（resolve）和拒绝（reject）函数的 Promise。
 * @returns 包含 promise、resolve、reject 的对象
 */
export function withResolvers<T>(): PromiseWithResolvers<T> {
  const out = {} as PromiseWithResolvers<T>
  out.promise = new Promise<T>((resolve_, reject_) => {
    out.resolve = resolve_
    out.reject = reject_
  })
  return out
}

/**
 * 获取指定名称的 Cookie 值。
 * @param name - Cookie 名称
 * @returns 对应的 Cookie 值，若不存在返回 undefined
 */
export function getCookie(name: string): string | undefined {
  const r = document.cookie.match(`\b${name}=([^;]*)\b`)
  return r ? r[1] : undefined
}

/**
 * 设置 Cookie 值。
 * @param name - Cookie 名称
 * @param value - Cookie 值
 * @param expiration - 过期时间（可选）
 */
export function setCookie(name: string, value?: string, expiration?: Date): void {
  const expirationDate = value ? expiration : new Date()
  const expirationStr: string = expirationDate ? `expires=${expirationDate.toUTCString()};` : ''
  document.cookie = `${name}=${value};${expirationStr}path=/`
}

/**
 * 检查 localStorage 是否可用。
 * @returns 若可用返回 true，否则返回 false
 */
export function localStorageAvailable(): boolean {
  const testData = '@kazura/web-util#testData'

  try {
    const { localStorage } = window
    localStorage.setItem(testData, testData)
    localStorage.getItem(testData)
    localStorage.removeItem(testData)
  } catch (e) {
    return false
  }
  return true
}

/**
 * 判断当前页面是否通过 HTTPS 访问。
 * @returns 若为 HTTPS 返回 true，否则返回 false
 */
export function isHttps(): boolean {
  return window.location.href.startsWith('https://')
}

/**
 * 判断当前页面是否通过 HTTP 访问。
 * @returns 若为 HTTP 返回 true，否则返回 false
 */
export function isHttp(): boolean {
  return window.location.href.startsWith('http://')
}

/**
 * 判断当前页面是否在子 iframe 中嵌套。
 * @returns 若在子 iframe 中返回 true，否则返回 false
 */
export function isInChildFrame(): boolean {
  return window.parent !== window
}

/**
 * 获取当前时区。
 * @returns 当前时区的字符串（例如 'Asia/Shanghai'）
 */
export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * 获取当前时区的时差（以分钟为单位）。
 * @returns 当前时区的时差（分钟）
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset()
}

/**
 * 获取浏览器的首选语言。
 * @returns 浏览器语言字符串（例如 'en-US'、'zh-CN'）
 */
export function getLocaleLanguage(): string {
  return navigator.language
}

/**
 * 返回基于当前日期和 Math.random 模块生成的唯一标识符（UID）。
 * @returns 生成的 UID 字符串
 */
export function generateUID(): string {
  return Math.floor(Date.now() / 1000).toString(36) + Math.random().toString(36).slice(-6)
}

/**
 * 将字节大小格式化为可读的字符串。
 * @param bytes  要格式化的字节大小
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (!isNumber(bytes) || bytes < 0) return 'Invalid size'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
}
