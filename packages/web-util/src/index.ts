export * from './file'
export * from './image'
export * from './register-event'
export * from './window-fission'
export * from './get-query-variable'
export * from './pattern'

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
export const copy = (text: string): boolean => {
  const elm = document.createElement('textarea')
  elm.value = text
  document.body.appendChild(elm)
  elm.select()

  let sussess = false
  try {
    document.execCommand('copy')
    sussess = true
  } catch (error) {
    console.error(error)
  } finally {
    document.body.removeChild(elm)
  }

  return sussess
}
