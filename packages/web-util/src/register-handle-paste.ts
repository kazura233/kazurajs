import { getElement } from './get-element'

export const registerHandlePaste = (
  selectors: HTMLElement | string,
  callback: (files: File[]) => any
) => {
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

  const element = getElement(selectors)

  element.addEventListener('paste', pasteListener)

  return () => element.removeEventListener('paste', pasteListener)
}
