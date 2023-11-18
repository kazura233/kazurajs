import { getElement } from './get-element'

export class Win {
  readonly window: Window

  constructor(win: Window) {
    this.window = win
  }

  /**
   * 添加事件监听器，并返回一个函数，用于取消监听。
   * @param type - 事件类型
   * @param listener - 事件监听器函数
   * @param options - 事件监听器选项
   * @returns - 用于取消监听的函数
   */
  addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): () => void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    this.window.addEventListener(type, listener, options)
    return () => this.window.removeEventListener(type, listener, options)
  }

  /**
   * 静态方法，向全局 window 添加事件监听器，并返回一个函数，用于取消监听。
   * @param type - 事件类型
   * @param listener - 事件监听器函数
   * @param options - 事件监听器选项
   * @returns - 用于取消监听的函数
   */
  static addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): () => void
  static addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    window.addEventListener(type, listener, options)
    return () => window.removeEventListener(type, listener, options)
  }
}

export const win = (win: Window) => new Win(win)

export class Dom<T extends HTMLElement> {
  readonly element: T

  constructor(selector: T | string) {
    this.element = getElement(selector)
  }

  /**
   * 添加事件监听器，并返回一个函数，用于取消监听。
   * @param type - 事件类型
   * @param listener - 事件监听器函数
   * @param options - 事件监听器选项
   * @returns - 用于取消监听的函数
   */
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => any,
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

  /**
   * 静态方法，向全局 document 添加事件监听器，并返回一个函数，用于取消监听。
   * @param type - 事件类型
   * @param listener - 事件监听器函数
   * @param options - 事件监听器选项
   * @returns - 用于取消监听的函数
   */
  static addEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): () => void
  static addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    document.addEventListener(type, listener, options)
    return () => document.removeEventListener(type, listener, options)
  }
}

export const dom = <T extends HTMLElement>(selector: T | string) => new Dom(selector)
