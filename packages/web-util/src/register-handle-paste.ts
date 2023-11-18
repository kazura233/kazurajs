export const registerHandlePaste = (
  selectors: HTMLElement | string,
  callback: (file: File, fileName: string) => void
) => {
  const pasteListener = (event: ClipboardEvent) => {
    const { items, types } = event.clipboardData!
    if (types.indexOf('Files') > -1) {
      for (let index = 0; index < items.length; index++) {
        const item = items[index]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            callback(file, file.name)
            event.preventDefault()
            event.stopPropagation()
          }
        }
      }
    }
  }

  let element: HTMLElement
  if (typeof selectors === 'string') {
    const ele = document.querySelector<HTMLElement>(selectors)
    if (!ele) throw Error()
    element = ele
  } else {
    element = selectors
  }

  element.addEventListener('paste', pasteListener)
  return () => element.removeEventListener('paste', pasteListener)
}
