export const getElement = <T extends HTMLElement>(selector: T | string): T => {
  if (typeof selector === 'string') {
    const element = document.querySelector<T>(selector)
    if (!element) throw new Error(`Element with selector '${selector}' not found`)
    return element
  } else {
    return selector
  }
}
