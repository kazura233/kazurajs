/**
 * 获取指定选择器或元素对象，并返回类型为 T 的 HTMLElement。
 * @param selector - 要获取的选择器字符串或现有元素对象。
 * @throws 如果选择器无法匹配到任何元素，则抛出错误。
 * @returns 匹配到的或传入的元素对象，类型为 T 的 HTMLElement。
 */
export const getElement = <T extends HTMLElement>(selector: T | string): T => {
  // 如果选择器是字符串，则使用 document.querySelector 获取元素。
  if (typeof selector === 'string') {
    const element = document.querySelector<T>(selector)
    if (!element) throw new Error(`Element with selector '${selector}' not found`)
    return element
  } else {
    // 如果选择器是元素对象，则直接返回。
    return selector
  }
}
