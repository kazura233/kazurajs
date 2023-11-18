import { getElement } from './get-element'

export const registerHandleDrop = (
  selectors: HTMLElement | string,
  callback: (files: File[]) => any
) => {
  const dragoverListener = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

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

  const element = getElement(selectors)

  element.addEventListener('dragover', dragoverListener)
  element.addEventListener('drop', dropListener)

  return () => {
    element.removeEventListener('dragover', dragoverListener)
    element.removeEventListener('drop', dropListener)
  }
}
