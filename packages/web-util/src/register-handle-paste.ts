import { getElement } from './get-element'

/**
 * 注册处理粘贴事件的函数。
 * @param selectors - 要注册粘贴事件的元素选择器或元素对象。
 * @param callback - 粘贴完成后的回调函数，接受粘贴的文件数组作为参数。
 * @returns 一个函数，用于取消注册的粘贴事件监听器。
 */
export const registerHandlePaste = (
  selectors: HTMLElement | string,
  callback: (files: File[]) => any
) => {
  /**
   * 粘贴事件的监听器，获取粘贴板中的文件信息并触发回调函数。
   * @param event - ClipboardEvent 事件对象。
   */
  const pasteListener = (event: ClipboardEvent) => {
    const { items, types } = event.clipboardData!

    if (types.includes('Files')) {
      const files: File[] = Array.from(items)
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile()!)

      if (files.length > 0) {
        event.preventDefault()
        event.stopPropagation()
        callback(files)
      }
    }
  }

  // 获取对应元素。
  const element = getElement(selectors)

  // 添加粘贴事件监听器。
  element.addEventListener('paste', pasteListener)

  // 返回一个函数，用于取消注册的粘贴事件监听器。
  return () => element.removeEventListener('paste', pasteListener)
}
