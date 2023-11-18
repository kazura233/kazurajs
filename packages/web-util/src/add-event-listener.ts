import { getElement } from './get-element'

export class Win {
  readonly window: Window

  constructor(win: Window) {
    this.window = win
  }

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
