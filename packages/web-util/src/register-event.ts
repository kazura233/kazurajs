import { getElement } from './get-element'

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

export class Dom<T extends HTMLElement> {
  readonly element: T

  constructor(selector: T | string) {
    this.element = getElement(selector)
  }

  addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: T, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): () => void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    this.element.addEventListener(type, listener, options)

    return () => this.element.removeEventListener(type, listener, options)
  }
}

export const dom = <T extends HTMLElement>(selector: T | string) => new Dom(selector)
