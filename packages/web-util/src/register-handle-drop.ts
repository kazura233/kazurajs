import { getElement } from './get-element'

export const registerHandleDrop = (
  selectors: HTMLElement | string,
  callback: (file: File, fileName: string) => void
) => {
  const dragoverListener = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const dropListener = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const { items, types } = event.dataTransfer!
    const fileItem = Array.from(items).find((item) => item.kind === 'file')

    if (fileItem && types.includes('Files')) {
      const file = fileItem.getAsFile()
      if (file) {
        callback(file, file.name)
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
