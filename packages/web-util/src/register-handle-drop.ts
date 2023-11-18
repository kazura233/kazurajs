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
    if (types.indexOf('Files') > -1) {
      for (let index = 0; index < items.length; index++) {
        const item = items[index]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            return callback(file, file.name)
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

  element.addEventListener('dragover', dragoverListener)
  element.addEventListener('drop', dropListener)
  return () => {
    element.removeEventListener('dragover', dragoverListener)
    element.removeEventListener('drop', dropListener)
  }
}
