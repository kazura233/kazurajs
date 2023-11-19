import { getElement } from './get-element'

/**
 * 注册处理拖放事件的函数。
 * @param selectors - 要注册拖放事件的元素选择器或元素对象。
 * @param callback - 拖放完成后的回调函数，接受拖放的文件数组作为参数。
 * @returns 一个函数，用于取消注册的拖放事件监听器。
 */
export const registerHandleDrop = (
  selectors: HTMLElement | string,
  callback: (files: File[]) => any
) => {
  /**
   * 拖放区域的 dragover 事件监听器，防止默认行为和事件传播。
   * @param event - DragEvent 事件对象。
   */
  const dragoverListener = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  /**
   * 拖放区域的 drop 事件监听器，防止默认行为和事件传播，并获取拖放的文件信息。
   * @param event - DragEvent 事件对象。
   */
  const dropListener = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const { items, types } = event.dataTransfer!

    if (types.includes('Files')) {
      const files: File[] = Array.from(items)
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile()!)

      if (files.length > 0) {
        callback(files)
      }
    }
  }

  // 获取对应元素。
  const element = getElement(selectors)

  // 添加 dragover 和 drop 事件监听器。
  element.addEventListener('dragover', dragoverListener)
  element.addEventListener('drop', dropListener)

  // 返回一个函数，用于取消注册的拖放事件监听器。
  return () => {
    element.removeEventListener('dragover', dragoverListener)
    element.removeEventListener('drop', dropListener)
  }
}
