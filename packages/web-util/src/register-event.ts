/**
 * 注册一个全局事件，并返回析构函数。
 * @param type
 * @param listener
 * @param options
 */
export function registerEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void

export function registerEvent(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void {
  window.addEventListener(type, listener, options)
  return () => window.removeEventListener(type, listener, options)
}
